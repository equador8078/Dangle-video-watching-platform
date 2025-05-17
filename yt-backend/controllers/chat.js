const { generateEmbedding,cosineSimilarity } = require('./embedding');
const VIDEO = require('../models/video');
const USER= require('../models/user')
const fetch = require('node-fetch');


const getTopVideos = async (req, res) => {
    try {
        const { prompt } = req.body;
        const promptEmbedding = await generateEmbedding(prompt);

        const allVideos = await VIDEO.find({archive: false}).limit(1000);
        const scored =await Promise.all(
        allVideos
        .map(async(video) => {
            const owner = await USER.findById(video.userID).select("fullName email");
            const score= cosineSimilarity(promptEmbedding, video.embedding);
            return {...video._doc, owner, score}
        }))

        scored.sort((a, b) => b.score - a.score);

        const topVideos = scored.slice(0, 3).map(v => ({
            creatorName: v.owner.fullName,
            title: v.title,
            description: v.description,
            id: v._id,
        }));

        const aiReply = await generateAiResponse(prompt, topVideos);
        return res.json({ reply: aiReply,videos: scored });

    } catch (error) {
        console.error("Error in getTopVideos:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

const generateAiResponse = async (prompt, topVideos) => {
    const systemPrompt = `
    You are a smart recommendation assistant. The user asked:
    "${prompt}"

    Here are top 3 videos(wit titles and the creators who posted these videos respectively) matched based on their prompt:
    1. Title : ${topVideos[0].title} Creator: ${topVideos[0].creatorName}
    2. Title : ${topVideos[1].title} Creator: ${topVideos[1].creatorName}
    3. Title : ${topVideos[2].title} Creator: ${topVideos[2].creatorName}
    Talk to user with this info or answer if any general question is asked!!
    `;

    try{
        const chatResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3-8b-8192",
                messages: [{ role: "user", content: systemPrompt }],
                temperature: 0.7
            })
        });
    
        const response = await chatResponse.json();
        return response.choices[0].message.content;
    }
    catch(error){
        console.log("Error while getting response from AI", error);
        return res.status(500).json({message:"Error has occurred while getting response from AI"})
    }

};

module.exports = {
    getTopVideos,cosineSimilarity
};
