const mongoose=require('mongoose');

const videoSchema=mongoose.Schema({
    publicId:{
        type:String,
        required:true,
    },
    title:{
        type:String,
    },
    description:{
        type:String,
    },
    videoURL:{
        type:String,
        required:true,
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true,
    },
    viewsCount:{
        type:Number,
    },
    likesCount:[
        {type:mongoose.Schema.Types.ObjectId, ref: 'User'}
    ],
    views:{
        type:Number,
        default:0
    },
    dislikeCount:[
        {type:mongoose.Schema.Types.ObjectId,ref:'User'}
    ],
    archive:{
            type:Boolean,
            default:false,
        },
    uploadDate:{
        type:Date,
        default:Date.now,
    },
    embedding:[
            {
                type:[Number],
                default:[],
            }
    ],
    category:{
        type:String,
        enum:['MUSIC','SPORTS','ENTERTAINMENT','EDUCATION','GAMING'],
        default:'ENTERTAINMENT'
    }
})

const VIDEO=mongoose.model('video',videoSchema);
module.exports=VIDEO;