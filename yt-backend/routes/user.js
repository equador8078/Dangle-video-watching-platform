const express= require('express');
const USER=require("../models/user");
const {signup, login, getUserDetails, logout, deleteHistory,updateProfileImage,addRemoveSubscription,getCreatorPublicDetail,fetchSubscriptionList}= require('../controllers/user')
const { createPlayList, addVideoToPlayList, fetchPlaylist,fetchPlaylistVideos,deletePlaylistVideo, deletePlaylist }= require('../controllers/playlist')
const router= express.Router();

router.post('/signup',signup)

router.post('/login',login)

router.get('/me',getUserDetails)

router.post('/logout',logout)

router.delete('/deleteHistory/:videoId',deleteHistory);

router.post('/createPlaylist',createPlayList)

router.post('/addToPlaylist', addVideoToPlayList)

router.get('/playlists', fetchPlaylist);

router.get('/playlistVideos', fetchPlaylistVideos);

router.post('/uploadProfileImage',updateProfileImage)

router.delete('/deletePlaylistVideo/:playlistId/video/:videoId',deletePlaylistVideo)

router.put('/updateSubscription',addRemoveSubscription);

router.get('/getCreatorDetails',fetchSubscriptionList)

router.delete('/deletePlaylist/:playlistId',deletePlaylist)


// router.get('/')

module.exports=router;