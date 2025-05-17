const express = require('express');
const { upload} = require('../public/uploads');
const { uploadVideo, fetchAllVideos, fetchSingleVideo, fetchHistoryVideo,
    updateLikeAndDislike, fetchUserVideos, updateVideo,handelDeleteVideo, archiveVideo,fetchSideVideos} = require('../controllers/video')

const videoRouter = express.Router();

videoRouter.post('/upload', upload.single('video'), uploadVideo);

videoRouter.get('/getAllVideos', fetchAllVideos)

videoRouter.get('/getAVideo/:videoId', fetchSingleVideo)

videoRouter.get('/historyVideos', fetchHistoryVideo)
videoRouter.put('/updateLikeDislike', updateLikeAndDislike);
videoRouter.get(`/userVideos`, fetchUserVideos)

videoRouter.put('/updateVideo/:videoID', updateVideo);

videoRouter.delete('/deleteVideo', handelDeleteVideo);

videoRouter.post('/updateArchive',archiveVideo);

videoRouter.get("/fetchSideVideos/:currentVideoId",fetchSideVideos);

module.exports = videoRouter;
