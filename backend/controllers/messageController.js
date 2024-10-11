const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = expressAsyncHandler(async(req,res) => {
  
  const { msg, chatId } = req.body;
    
    if (!msg || !chatId) {
        res.status(400).json({ msg: 'Invalid msg or chat id' })
      return
    }
    
    console.log(msg)
    console.log(chatId)
    try {
        let newMessage = await Message.create({
            sender: req.user._id,
            content: msg,
            chat: chatId
        })

        newMessage = await newMessage.populate('sender', 'name pic')
        newMessage = await newMessage.populate('chat')
        newMessage = await User.populate(newMessage, {
            path: 'chat.users',
            select:'name pic email'
        })

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage:newMessage
        })

        res.json(newMessage)


        
    } catch (error) {
        
        res.status(400).json({ msg: 'Error sending message' })
    }


})


const allMessages = expressAsyncHandler(async (req, res) => {
    const chatId = req.params.chatId;
    try {
        const msg = await Message.find({ chat: chatId }).populate('sender', 'name pic ').populate('chat')
        
        res.json(msg)
    } catch (error) {
        res.status(400).json({msg:'No message here'})
    }
})


module.exports = {sendMessage,allMessages}