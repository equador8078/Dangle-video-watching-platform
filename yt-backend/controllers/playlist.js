const PLAYLIST = require('../models/playlist');
const VIDEO= require('../models/video')
const USER=require('../models/user')

const createPlayList = async (req, res) => {
    const { playlistName } = req.body;
    const creatorId=req.user?._id;

    try {
        const newPlaylist = await PLAYLIST.create({  playlistName,creatorId});
        return res.status(201).json({ newPlaylist: newPlaylist });
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const addVideoToPlayList = async (req, res) => {
    const { videoId,playlistId } = req.body;
    try {
        const updatedPlaylist = await PLAYLIST.findByIdAndUpdate(
            playlistId,
            { $push: { videos: videoId } },
            { new: true }
        );

        if (!updatedPlaylist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        return res.status(200).json({ message: "Video added to playlist", playlist: updatedPlaylist });
    } catch (error) {
        console.error("Error adding video to playlist:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const fetchPlaylist=async (req,res)=>{
    try{
        const creatorId=req.user?._id;
        const playlists=await PLAYLIST.find({creatorId:creatorId})
        if(!playlists){
            return res.status(200).json({message:"No playlist created"})
        }

        return res.status(200).json(playlists);
    }
    catch(error){
        console.log("error fetching playlist", error);
        return res.status(500).json({message:"Internal server error"})
    }
}

const fetchPlaylistVideos = async (req, res) => {
    try {
        let videoIds = req.query.videoIds;
        if (!videoIds) return res.status(400).json({ error: "No video IDs provided" });

        videoIds = Array.isArray(videoIds) ? videoIds : videoIds.split(",");

        const files = await Promise.all(
            videoIds.map(async (id) => await VIDEO.findById(id))
        );

        const videosWithOwner = await Promise.all(
            files.map(async (video) => {
                if (!video) return null;  // Handle potential null values
                const owner = await USER.findById(video.userID).select("fullName email");
                return { ...video._doc, owner };
            })
        );

        res.status(200).json(videosWithOwner.filter(Boolean)); // Remove null values
    } catch (error) {
        console.log("Error fetching video", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const deletePlaylistVideo=async(req,res)=>{
    const {playlistId,videoId}=req.params
    if(!playlistId || !videoId){
        return res.status(404).json({message:"playlist or video not found"})
    }
    try{
        const updatedPlaylist=await PLAYLIST.findOneAndUpdate({_id:playlistId},
            {$pull:{videos:videoId}},
            {new:true}
        )
        return res.status(200).json({message:'video deleted successfully',playlist:updatedPlaylist})

    }
    catch(error){
        console.log("Error deleting playlist video",error)
        res.status(500).json({message:'Internal Server Error'})
    }
}

const deletePlaylist=async(req,res)=>{
    try{
        const {playlistId}=req.params;
        if(!playlistId){
            console.log("No video Id found");
            return res.Status(201).json({message:"Noi video Id found"});
        }

        await PLAYLIST.findByIdAndDelete(playlistId);
        return res.status(200).json({message:"Playlist deleted successfully!!"})
    }
    catch(error){
        console.log("error deleting playlist", error);
        return res.status(201).json({message:"Internal Server Error"});
    }
}


module.exports = { createPlayList, addVideoToPlayList, fetchPlaylist,fetchPlaylistVideos,deletePlaylistVideo, deletePlaylist };