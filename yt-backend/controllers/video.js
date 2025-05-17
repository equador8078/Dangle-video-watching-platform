const VIDEO = require('../models/video');
const USER = require('../models/user')
const { verifyToken } = require('../services/authentication')
const { updateUserDetails } = require('./user')
const { deleteVideo } = require('../public/uploads')
const {generateEmbedding,cosineSimilarity}=require('./embedding')


const uploadVideo = async (req, res) => {
    if (!req.file) {
        console.log("❌ req.file is undefined");
        return res.status(400).json({ error: "No video file uploaded" });
    }

    try {
        const { filename } = req.file;

        const { title, description, category } = req.body

        const token = req.cookies.token;
        const payLoad = verifyToken(token);
        const userID = payLoad._id;
        const fullText = `${payLoad.fullName} ${title} ${description}`;
        const embedding = await generateEmbedding(fullText);

        if (embedding.length !== 512) {
            console.error('Invalid embedding length:', embedding);
            return res.status(400).json({ error: 'Invalid embedding length' });
        }

        const newVideo = new VIDEO({
            publicId: filename,
            title: title,
            description: description,
            videoURL: req.file.path,
            userID: userID,
            category: category,
            embedding: embedding,
        });

        await newVideo.save();

        res.json({ message: 'Video uploaded successfully', video: newVideo });
    } catch (error) {
        console.error("❌ Error saving video:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const fetchAllVideos = async (req, res) => {
    try {
        const files = await VIDEO.find()

        const videosWithOwner = await Promise.all(
            files.map(async (video) => {
                const owner = await USER.findById(video.userID).select("fullName email");
                return { ...video._doc, owner };
            })
        )
        res.status(200).json(videosWithOwner);
    }
    catch (error) {
        console.log("Error fetching video", error);
    }
}

const updateVideoViews = async (videoId) => {
    try {
        await VIDEO.findOneAndUpdate({ _id: videoId },
            { $inc: { views: 1 } },
            { new: true }
        )
    }
    catch (error) {
        console.log("Error while updating views")
    }
}


const fetchSingleVideo = async (req, res) => {
    const videoId = req.params.videoId;
    const userId = req.user?._id;

    try {
        await updateUserDetails(userId, videoId)
        await updateVideoViews(videoId)
    }
    catch (error) {
        console.log(error)
    }
    try {
        const video = await VIDEO.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        const owner = await USER.findById(video.userID);
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }
        const videoWithOwner = { ...video._doc, owner };

        res.status(200).json(videoWithOwner)
    }
    catch (error) {
        console.log("some error occurred while fetching video: ", error)
        re.status(500).json({ message: "Internal server error!" })
    }
}

const fetchHistoryVideo = async (req, res) => {
    try {
        const { watchHistory } = req.user;

        if (!watchHistory || watchHistory.length === 0) {
            return res.status(200).json({ message: "No videos watched yet!" });
        }

        const videos = await VIDEO.find({ _id: { $in: watchHistory } });

        const videosWithOwner = await Promise.all(
            videos.map(async (video) => {
                const owner = await USER.findById(video.userID).select("fullName email profileImg");
                return { ...video._doc, owner };
            })
        );

        return res.status(200).json(videosWithOwner);
    } catch (error) {
        console.error("Server error fetching history videos:", error);
        return res.status(500).json({ message: "Server error while fetching watch history videos" });
    }
};

const updateLikeAndDislike = async (req, res) => {
    try {
        const { liked, videoId } = req.body;
        const userId = req.user?._id;

        const video = await VIDEO.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const hasLiked = video.likesCount.includes(userId);
        const hasDisliked = video.dislikeCount.includes(userId);

        const update = {
            $pull: {},
            $addToSet: {}
        };

        if (liked) {
            if (hasDisliked) update.$pull.dislikeCount = userId;
            if (!hasLiked) update.$addToSet.likesCount = userId;
            if (hasLiked) update.$pull.likesCount = userId;
        } else {
            if (hasLiked) update.$pull.likesCount = userId;
            if (!hasDisliked) update.$addToSet.dislikeCount = userId;
            if (hasDisliked) update.$pull.dislikeCount = userId;
        }

        if (Object.keys(update.$pull).length === 0) delete update.$pull;
        if (Object.keys(update.$addToSet).length === 0) delete update.$addToSet;

        const updatedVideo = await VIDEO.findByIdAndUpdate(videoId, update, { new: true });

        res.status(200).json({ message: 'Video like/dislike updated successfully', video: updatedVideo });

    } catch (error) {
        console.error("Error updating like/dislike:", error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


const fetchUserVideos = async (req, res) => {
    const userId = req.user?._id

    if (!userId) {
        return res.status(400).json({ message: "Please login to see your videos!!😕" });
    }
    try {
        const videos = await VIDEO.find({ userID: userId })
        if (!videos) {
            return res.status(200).json({ message: `No videos for user ${userId}` })
        }

        const videosWithOwner = await Promise.all(
            videos.map(async (video) => {
                const owner = await USER.findById(video.userID).select("fullName email profileImg");
                return { ...video._doc, owner };
            })
        );

        return res.status(200).json({ message: `Video riteved successfully ${userId}`, videosWithOwner })
    }
    catch (error) {
        console.log("Error fetching user videos ", error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const updateVideo = async (req, res) => {
    try {
        const videoId = req.params.videoID;
        const { title, description, category } = req.body

        if (!videoId) {
            return res.status(400).json({ message: "Video Id is not defined" })
        }
        const updatedVideo = await VIDEO.findByIdAndUpdate(videoId,
            { title, description, category },
            { new: true })

        return res.status(200).json({ message: "video updated successfully" })
    }
    catch (error) {
        console.log("Error occurred while updating video");
        return res.status(400).json({ message: "Error while updating video" })
    }
}

const handelDeleteVideo = async (req, res) => {
    try {
        const { videoId, publicId } = req.body;

        if (!videoId || !publicId) {
            return res.status(400).json({ message: "Missing video or public ID" });
        }

        const cloudinaryResult = await deleteVideo(publicId);
        if (cloudinaryResult.error) {
            return res.status(400).json({ message: cloudinaryResult.message });
        }

        const deletedVideo = await VIDEO.findByIdAndDelete(videoId);
        if (!deletedVideo) {
            return res.status(404).json({ message: "Video not found in database" });
        }

        return res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
        console.log("Deletion error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const archiveVideo = async (req, res) => {
    try {
        const { videoId, forUpdatingArchive } = req.body;
        if (!videoId) {
            return res.status(400).json({ message: "Video ID not provided" });
        }
        const video = await VIDEO.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        if (forUpdatingArchive) {
            video.archive = !video.archive;
            await video.save();
            return res.status(200).json({ message: "Video archive status updated", isArchive: video.archive });
        }
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        return res.status(200).json({ isArchive: video.archive });
    } catch (error) {
        console.error("Error occurred while updating archive:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const fetchSideVideos = async (req, res) => {
    try {
        const currentVideoId = req.params.currentVideoId;
        const currVideo=await VIDEO.findById(currentVideoId);
        const videos = await VIDEO.find().limit(100);

        const videosWithOwner = await Promise.all(
            videos.map(async (video) => {
                const owner = await USER.findById(video.userID).select("fullName email");
                const score = cosineSimilarity(currVideo.embedding,video.embedding)
                return { ...video._doc, owner,score };
            })
        )

        videosWithOwner.sort((a, b) => b.score - a.score);

        res.status(200).json(videosWithOwner);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error while fetching side videos" })
    }
}

module.exports = {
    uploadVideo, fetchAllVideos, fetchSingleVideo, fetchHistoryVideo,
    updateLikeAndDislike, fetchUserVideos, updateVideo, handelDeleteVideo, archiveVideo, fetchSideVideos
};
