const jwt = require("jsonwebtoken")
const dotenv = require('dotenv')
dotenv.config()
const jwtSecret = process.env.JWT_SECRET
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn:"30d"
    })
}

module.exports = generateToken