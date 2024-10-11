const User = require('../models/userModel');
const generateToken = require('../config/generateToken');
const expressAsyncHandler = require('express-async-handler');
const { query } = require('express');
const { decodeBase64 } = require('bcryptjs');

const registerUser = expressAsyncHandler(async (req, res) => {
	const { name, email, password, pic } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		throw new Error('Please Enter all the fields');
	}
	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}

	const user = await User.create({
		name,
		email,
		password,
		pic,
	});
	

	
	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin:user.isAdmin,
			pic: user.pic,
			token: generateToken(user._id),
		});
		console.log(`User from user controller :${user}`)
	} else {
		res.status(400);
		throw new Error('User not created');
	}
});

//login
const authUser = expressAsyncHandler(async (req, res) => {
	const { email, password } = req.body;
	
	if (!email || !password)
		return res.status(401).json({ msg: 'Please fill all the fields' });
	
	console.log({email,password})
	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			
			password: user.password,
			token: generateToken(user._id),
		});
	} else {
		res.status(401).json({ msg: 'Login failed' });
	}
});

//all users
const allUsers = expressAsyncHandler(async (req, res) => {
	const keyword = req.query.search
		
		? {
				$or: [
					{ name: { $regex: req.query.search, $options: 'i' } },
					{ email: { $regex: req.query.search, $options: 'i' } },
				],
		  }
		: {};

	try {
		const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
		console.log(users)
		if (users.length === 0) {
			return res.status(400).json({ msg: 'No users found' });
		}
		res.send(users)
	} catch (error) {
		res.status(400).json({ msg: "No users exists with this name" })
		console.log(error.message)
	}
});
module.exports = { registerUser, authUser, allUsers };
