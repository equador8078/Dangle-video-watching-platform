const mongoose=require('mongoose')

const commentSchema=mongoose.Schema({
    videoID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Video',
        required:true,
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    timestamp:{
        type:Date,
        default:Date.now,
    }
})

const COMMENT=mongoose.model('comment',commentSchema);
module.exports=COMMENT;