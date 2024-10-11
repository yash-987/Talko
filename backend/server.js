
const express = require('express');
const ConnectUrl = require('./config/db');
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const path = require('path');


dotenv.config()
ConnectUrl();
const app = express();


app.use(express.json());


app.use('/api/user', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/message', messageRoutes);









// -----------------------Deployment--------------------------


const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname1, '/frontend/dist')))
	
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname1,'frontend','dist','index.html'))
	})
} else {
	app.get('/', (req, res) => {
		console.log('api is running')
	})
}
// -----------------------Deployment--------------------------


app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT;

const server = app.listen(PORT,console.log(`Server running on PORT ${PORT}...`))


const io = require('socket.io')(server, {
	pingTimeOut: 60000,
	cors: {
		origin:'http://localhost:3000'
	}
})
io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('setup', (userData) => {
		socket.join(userData._id);
		// console.log(userData._id);
		socket.emit('connected');
	});

	socket.on('join chat', (room) => {
		socket.join(room);
		console.log('user joined room : ', room);
	});

	socket.on('typing', (room) => {
		socket.in(room).emit('typing');
	});

	socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));
	socket.on('new message', (newMessageRecieved) => {
		let chat = newMessageRecieved.chat;

		if (!chat.users) return console.log('chat.users not defined');

		chat.users.forEach((user) => {
			if (user.id === newMessageRecieved.sender._id) return;

			socket.in(user._id).emit('message recieved', newMessageRecieved);
		});
	});

	socket.off('setup', () => {
		console.log('user disconnected');
		socket.leave(userData._id);
	});
});
