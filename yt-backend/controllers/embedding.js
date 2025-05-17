const use = require('@tensorflow-models/universal-sentence-encoder');
const tf = require('@tensorflow/tfjs');

const generateEmbedding = async (text) => {
    const model = await use.load();
    const embeddings = await model.embed([text]);
    const vector = embeddings.arraySync()[0];
    return vector;
};

const cosineSimilarity = (vecA, vecB) => {
        if (Array.isArray(vecA[0])) vecA = vecA[0];
    if (Array.isArray(vecB[0])) vecB = vecB[0];

    if (!Array.isArray(vecA) || !Array.isArray(vecB)) return NaN;
    if (vecA.length !== vecB.length) return NaN;

    if (vecA.some(v => typeof v !== 'number' || isNaN(v) || !isFinite(v))) return NaN;
    if (vecB.some(v => typeof v !== 'number' || isNaN(v) || !isFinite(v))) return NaN;

    const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

    if (magA === 0 || magB === 0) return NaN;

    const score = dot / (magA * magB);
    return score;
};

module.exports = {generateEmbedding,cosineSimilarity};
