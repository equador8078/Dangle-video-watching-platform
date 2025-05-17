const COMMENT = require('../models/comments');
const USER = require('../models/user');

const fetchComments = async (req, res) => {
    try {
        const videoId = req.params.videoId;
        if (!videoId) {
            return res.status(500).json({ error: "VideoId not found" });
        }
        const comments = await COMMENT.find({ videoID: videoId }).sort({ timestamp: -1 }).lean();

        const commentsWithOwner = await Promise.all(
            comments.map(async (comment) => {
                const commentOwner = await USER.findById(comment.userID).select("fullName profileImg");
                return { ...comment, commentOwner }
            })
        )

        return res.status(200).json({ commentsWithOwner:commentsWithOwner });

    }
    catch (error) {
        return res.status(500);
    }
}

const addComment = async (req, res) => {
    try {
        const { videoId, content,userId } = req.body;

        if (!videoId || !userId) {
            return res.status(500);
        }

        const newComment = new COMMENT({
            videoID: videoId,
            userID: userId,
            content: content,
        })

        await newComment.save();

        return res.status(200).json({ message: "Comment save successfully" });
    }
    catch (error) {
        return res.status(500);
    }
}

module.exports = { addComment, fetchComments }