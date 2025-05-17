const jwt=require('jsonwebtoken');
const secret="youtube";

function createUserToken(user){
    const payLoad={
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profileImg:user.profileImg,
        subscriptionList:user.subscriptionList,
        watchHistory:user.watchHistory,
    }

    const token= jwt.sign(payLoad,secret);

    return token;
}

function verifyToken(token){
    const payLoad=jwt.verify(token,secret);
    return payLoad;
}

module.exports={createUserToken, verifyToken}