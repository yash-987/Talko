const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken")
const dotenv = require('dotenv'
);
const User = require("../models/userModel");
dotenv.config()
const jwtPass = process.env.JWT_SECRET;
const protect = expressAsyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer') 
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, jwtPass)
            
            req.user = await User.findById(decoded.id).select('-password')
            next()
        } catch (error) {
            res.status(400).json({msg:error.message})
        }
    } else {
        res.status(400).json({
            msg:"No token"
        })
    }
})

module.exports = protect