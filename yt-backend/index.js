const express = require('express');
const mongoose = require('mongoose');
const path=require('path');
const cors = require("cors");
const cookieParser =require('cookie-parser');
const router = require('./routes/user');
const videoRouter= require('./routes/video');
const aiRouter=require('./routes/chat')
const commentRouter=require('./routes/comments');
const {checkIfCookieExists}=require("./middleware/authentication")


const app=express();

const _dirname =path.resolve();

app.use(express.json());

const URL = process.env.MONGO_URL;

mongoose.connect(URL).then(()=>console.log("MongoDB connected!"))
app.use(express.urlencoded({extended:false}))

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(cookieParser())
app.use(checkIfCookieExists("token"));
app.use(express.static(path.resolve('./public')))


app.use('/user',router);
app.use('/videos',videoRouter);
app.use('/ai',aiRouter)
app.use('/comment',commentRouter);

app.use(express.static(path.join(_dirname,"/yt-frontend/dist")))
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(_dirname,"yt-frontend","dist","index.html"));
})

app.listen(process.env.PORT,()=>console.log(`Server started at PORT:${process.env.PORT}`));