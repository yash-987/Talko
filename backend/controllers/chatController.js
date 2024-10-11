const expressAsyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// accessing or creating one on one chat
const accessChat = expressAsyncHandler(async (req, res) => {
	const { userId } = req.body;
	if (!userId) {
		res.status(400).json({ msg: 'Please provide user Id' });
		return;
	}
	let newChat = await Chat.find({
		isGroupChat: false,
		$and: [
			{ users: { $elemMatch: { $eq: req.user._id } } },
			{ users: { $elemMatch: { $eq: userId } } },
		],
	})
		.populate('users', '-password')
		.populate('latestMessage');

	newChat = await User.populate(newChat, {
		path: 'latestMessage.sender',
		select: 'name email pic',
	});

	if (newChat.length > 0) {
		res.send(newChat[0]);
	} else {
		let chatData = {
			chatName: 'sender',
			isGroupChat: false,

			users: [req.user._id, userId],
		};
		try {
			const createdChat = await Chat.create(chatData);
			const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
				'users',
				'-password'
			);
			res.status(200).send(fullChat);
		} catch (error) {
			res.status(400).json({ msg: error.message });
		}
	}
});

//fetch all chats of the logged user
const fetchChats = expressAsyncHandler(async (req, res) => {
	try {
		let chats = await Chat.find({
			users: { $elemMatch: { $eq: req.user._id } },
		})
			.populate('users', '-password')
			.populate('groupAdmin')
			.populate('latestMessage');

		chats = await User.populate(chats, {
			path: 'latestMessage.sender',
			select: 'name email pic',
		});

		res.send(chats);
		
	} catch (error) {
		res.status(400).json({ msg: 'No Chats found' });
	}
});

//creating group chats
const groupChats = expressAsyncHandler(async (req, res) => {
	let users = req.body.users;
	const chatName = req.body.chatName;

	if (!users || !chatName) {
		res.status(400).json({
			msg: 'Please provide all fields',
		});
	}
	users = JSON.parse(users);
	if (users.length < 2) {
		res.status(400).json({ msg: 'A group must require more than 2 users' });
	}
	users.push(req.user);

	try {
		const groupChat = await Chat.create({
			chatName,
			users,
			isGroupChat: true,
			groupAdmin: req.user,
		});
		const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
			.populate('users', '-password')
			.populate('groupAdmin', '-password');
		res.send(fullGroupChat);
	} catch (error) {
		res.status(400).json({ msg: error.message });
	}
});

//renaming the group chat name
const renameGroupChat = expressAsyncHandler(async (req, res) => {
	const { newName, chatId } = req.body;

	const updatedChat = await Chat.findByIdAndUpdate(
		chatId,
		{
			chatName: newName,
		},
		{
			new: true,
		}
	)
		.populate('users', '-password')
		.populate('groupAdmin', '-password');

	if (!updatedChat) {
		return res.status(400).json({ msg: "Can't update the chat" });
	}

	res.send(updatedChat);
});

// add a user to group
const addToGroup = expressAsyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;

	const added = await Chat.findByIdAndUpdate(
		chatId,
		{
			$push: { users: userId },
		},
		{
			new: true,
		}
	)
		.populate('users', '-password')
		.populate('groupAdmin', '-password');

	if (!added) {
		return res.status(400).json({ msg: "Can't add a user to a chat" });
	}

	res.json(added);
});

// remove a user from the group
const removeFromGroup = expressAsyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;

	const removed = await Chat.findByIdAndUpdate(
		chatId,
		{
			$pull: { users: userId },
		},
		{
			new: true,
		}
	)
		.populate('users', '-password')
		.populate('groupAdmin', '-password');

	if (!removed) {
		return res.status(400).json({ msg: "Can't remove a user from a chat" });
	}
	res.json(removed);
});
module.exports = {
	accessChat,
	fetchChats,
	groupChats,
	renameGroupChat,
	addToGroup,
	removeFromGroup,
};
