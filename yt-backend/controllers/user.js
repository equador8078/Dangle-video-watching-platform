const express= require('express');
const USER=require("../models/user");
const axios= require('axios');

const signup=async(req,res)=>{
    const {fullName, email, password}=req.body;
    console.log(req.body);
    try{
        await USER.create({
            fullName,
            email,
            password
        })
        return res.status(201).json({message:"Sign up successfully! Please login!"})
    }
    catch(error){
        if(error.code===11000){
            console.log(error)
            return res.status(400).json({message:"User already exists!"});
        }
        else{
            return res.status(500).json({message:"Error creating user!"});
        }
    }
}

const login=async (req,res)=>{
    const{email,password}=req.body;
    try{
        const user = await USER.findOne({email});
        if(!user){
            console.log("User not found")
            return res.status(401).json({message:"Incorrect email or password"})
        }

        const token=await USER.matchPasswordAndCreateToken(email,password);

        if(!token){
            console.log("Token not exists")
            return res.status(401).json({message:"Incorrect email or password"})
        }

        return res.cookie('token',token,{
            secure: false,
            sameSite: "Lax",
            path: '/'
        }).json({
            message:"Login successfully",
            user:{
                fullName:user.fullName,
                profileImg:user.profileImg,
                email:user.email
            }
        });
    }

    catch(error){
        console.log("other error",error)
        return res.json({message:"Incorrect Email or Password!"})
    }
}

const getUserDetails=(req,res)=>{
    try {
        if(!req.user) return res.status(401).json({message:"User not authenticated!"})

            return res.json({
                user:{
                    _id: req.user._id,
                    fullName:req.user.fullName,
                    profileImg:req.user.profileImg,
                    watchHistory:req.user.watchHistory,
                    subscriptionList:req.user.subscriptionList,
                    email:req.user.email
                }
            })
    }
    catch(error){
        console.log("Error occurred while getting User",error);
        return res.status(500).json({message:"Server error while getting user"})
    }
    
}

const logout=(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            path:'/',
            sameSite:'Lax',
    });
    return res.status(200).json({message:"Logged out Successfully "})
    }
    catch(error){
        console.log("Error logging out", error)
        res.status(500).json({message:"Error logging out"})
    }
}

const updateUserDetails=async(userId,videoId)=>{
    try{
        if(!userId){
            console.log("User is unauthorized! Can't save history!")
            return;
        }

        await USER.findOneAndUpdate(
            {_id: userId},
            {$addToSet:{watchHistory: videoId}},
            { new: true }
        )
        return ;
    }
    catch(error){
        console.log("Error while updating user details !", error);
    }
}


const deleteHistory=async (req,res)=>{
    try{
        let {videoId}=req.params ;
        const userId=req.user?._id;

        if(!userId || !videoId){
            console.log("Either userID not exists of video url not found ")
            return res.status(400);
        }
        const user=await USER.findById(userId);

        if(!user && !Array.isArray(user.watchHistory)){
            console.log("User not found or no history available")
            return res.status(404);
        }

        const newWatchHistory= user.watchHistory.filter(id=>id.toString() !== videoId.toString())
        await USER.findByIdAndUpdate(userId,
            {$set: {watchHistory:newWatchHistory}},
            { new: true },
        );
        return res.status(200).json({message:"History video deleted successfully"})
    }
    catch(error){
        console.log("Error deleting history", error);
    }
}

const updateProfileImage=async(req,res)=>{
    const {avatarURL}=req.body;
    const userId=req?.user;

    try{
        await USER.findByIdAndUpdate(userId,
            {profileImg:avatarURL},
            {new:true}
        );
        return res.status(200).json({message:'profile updated successfully'})

    }
    catch(error){
        console.log("Error CHOOSING USER AVATAR", error);
        return res.status(500).json({error:'error uploading the mg'})
    }
}

const addRemoveSubscription=async (req,res)=>{
    try{
    const {creatorId}=req.body;
    const userId=req.user?._id

    if(!userId || !creatorId){
        console.log("no userId or CreatorId")
        return res.json({message:"No user id or creator Id"});
    }

    const user =await USER.findById(userId);

    if(!user){
        return res.status(400).json({message:`No user exists in data base with Id ${userId}`})
    }

    const index = user.subscriptionList.indexOf(creatorId);
    if(index===-1){
        user.subscriptionList.push(creatorId);
    }
    else{
        user.subscriptionList.splice(index,1)
    }

    await user.save();
    return res.status(200).json({message:"Subscription list updated at backend!"})
}
catch(error){
    return res.status(400).json({message:"Internal Server Error"});
}
}

const getCreatorPublicDetail=async(req,res)=>{
    const {creatorId}=req.params
    if(!creatorId){
        return res.status(400).json({message:"Creator Id undefined"})
    }
    try{
        const creator=await USER.findById(creatorId).select("profileImg fullName")
        if(!creator){
            return res.status(404).json({message:"Creator not exist in database"})
        }
        return res.status(200).json({message:"creator fetched successfully",creator})
    }
    catch(error){
        console.log("Internal server error",error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

const fetchSubscriptionList=async(req,res)=>{
    const userId=req.user?._id;
    if(!userId){
        return res.status(400).json({message:"User Id undefined"})
    }
    try{
        const user=await USER.findById(userId);
        const creatorsIds=user.subscriptionList;
        if(!creatorsIds || creatorsIds.length===0 ){
            return res.status(400).json({message:"User does not have creator list"})
        }

        const creatorsWithDetails=await Promise.all(
            creatorsIds.map(async(creatorId)=>{
                const creator=await USER.findById(creatorId).select("profileImg fullName")
                return {...creatorId,creator}
            })
        )

        return res.status(200).json({message:"Creator Ids fetched successfully",creatorsWithDetails})

    }
    catch(error){
        return res.status(500).json({message:"Internal Server Error"})
    }
}

module.exports={signup , login, getUserDetails,updateUserDetails,
    logout, deleteHistory,updateProfileImage,addRemoveSubscription,getCreatorPublicDetail,fetchSubscriptionList};