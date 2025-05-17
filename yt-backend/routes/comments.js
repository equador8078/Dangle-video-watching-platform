const express= require('express');
const {addComment, fetchComments}=require('../controllers/comments');
const commentRouter=express.Router();

commentRouter.get("/fetchAllComments/:videoId",fetchComments);

commentRouter.post('/addComment',addComment);

module.exports=commentRouter;