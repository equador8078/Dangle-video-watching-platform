const mongoose = require('mongoose');
const { createHmac, randomBytes } = require('crypto');
const PLAYLIST= require('./playlist')
const {createUserToken} = require('../services/authentication')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
    },
    subscriptionList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'  // Corrected reference
        }
    ],
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'  // Corrected reference
        }
    ],
    playlists:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PLAYLIST'
        }
    ]
}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();

    const salt = randomBytes(16).toString('hex');
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest('hex');
    
    user.salt = salt;
    user.password = hashedPassword;

    next();
});

// Function to match password and create token
userSchema.statics.matchPasswordAndCreateToken = async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest('hex');

    if (hashedPassword !== userProvidedHash) return;

    const token = createUserToken(user);
    return token;
};

const USER = mongoose.model('User', userSchema);
module.exports = USER;
