const jwt = require('jsonwebtoken')
const user = require('../models/userModel');
const protect = async (req, res, next) => {
    // Middleware to protect routes
    //1) check if token exists
    let token;
    // Check if authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            //2) Verify token (is changed or expired?)
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            //3) if user still exists
            const currentUser = await user.findById(decoded.id);
            if (!currentUser) {
                return res.status(401).json({ message: 'The user belonging to this token does no longer exist.' });
            }
            //check if password is changed after the token is issued
            if (currentUser.passwordChangedAt) {
                //iat to timestamp 
                const changedTimestamp = parseInt(currentUser.passwordChangedAt.getTime() / 1000, 10);
                if (decoded.iat < changedTimestamp) {
                    return res.status(401).json({ message: 'Password has been changed please login agin.' });
                }
            }
            //Grant access to protected route
            req.user = currentUser;
            next();
        } catch (err) {
            return res.status(401).json({ message: err.message });
        }
    } if (!token) {
        return res.status(401).json({ message: 'you are not login please login' });
    }


}
const allowedTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'You are not allowed to perform this action'
            });
        }
        next();
    };
};

module.exports = {
    protect,
    allowedTo
}