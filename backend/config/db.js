const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const mongoUrl = process.env.Mongo_Url; 

const ConnectUrl = async () => {
    try {
        
        const connect = await mongoose.connect(mongoUrl)
        
        console.log('MongoDB Connected...');
    } catch (error) {
        console.log(error.message)
        process.exit()
        
    }
}

module.exports = ConnectUrl;
