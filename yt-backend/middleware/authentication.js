const { verifyToken } = require('../services/authentication');
const USER = require('../models/user');

function checkIfCookieExists(cookieName) {
    return async (req, res, next) => {
        const token = req.cookies[cookieName];
        
        if (!token) return next();

        try {
            const payload = verifyToken(token);
            const user = await USER.findById(payload._id);
            
            if (!user) {
                return next();
            }
            
            req.user = user;

        } catch (error) {
            console.log("Middleware error:", error);
        }
        return next();
    };
}

module.exports={checkIfCookieExists}