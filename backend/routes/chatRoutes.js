const express = require('express')
const protect = require('../middlewares/authMiddleware')
const {accessChat,fetchChats, groupChats, renameGroupChat, addToGroup, removeFromGroup} = require('../controllers/chatController')
const router = express.Router()

router.route("/").post(protect, accessChat)
router.route("/").get(protect, fetchChats)
router.route('/group').post(protect,groupChats)
router.route('/rename').put(protect, renameGroupChat)
router.route('/groupAdd').put(protect, addToGroup);
router.route('/groupRemove').put(protect,removeFromGroup)

module.exports = router 