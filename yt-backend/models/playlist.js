const mongoose = require("mongoose");
const VIDEO = require('./video')

const playlistSchema = new mongoose.Schema({
    playlistName: {
        type: String,
        required: true
    },
    creatorId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },

    videos: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: "VIDEO"
        }
    ],

    createdAt: {
    type: Date,
    default: Date.now
}
});

const PLAYLIST = mongoose.model("PLAYLIST", playlistSchema);

module.exports = PLAYLIST
