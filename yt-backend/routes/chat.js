const express= require('express');
const aiRouter=express.Router();
const {getTopVideos}=require('../controllers/chat')

aiRouter.post("/getAiRecommendedVideos",getTopVideos);

module.exports=aiRouter;