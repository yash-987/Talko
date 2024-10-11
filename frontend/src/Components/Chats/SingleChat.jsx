import { useRecoilState, useRecoilValue } from 'recoil';
import { FetchAtom, SelectedChatAtom } from '../../store/chat';
import { UserAtom } from '../../store/user';
import {
	Box,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../../config/ChatLogic';
import ProfileModel from './ProfileModel';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import { MessagesAtom } from '../../store/msg';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animations from '../animations/lottie.json';
import { NotificationAtom } from '../../store/notifications';
const ENDPOINT = 'http://localhost:3000';

let selectedChatCompare;
let socket;

export default function SingleChat() {
	const [fetchAgain, setFetchAgain] = useRecoilState(FetchAtom);
	const user = useRecoilValue(UserAtom);
	const [notifications, setNotifications] = useRecoilState(NotificationAtom);

	const [selectedChat, setSelectedChat] = useRecoilState(SelectedChatAtom);
	const [messages, setMessages] = useRecoilState(MessagesAtom);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState(' ');
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const [socketConneted, setSocketConnected] = useState(false);

	const toast = useToast();

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationsData: animations,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};
	const typingHandler = (e) => {
		setNewMessage(e.target.value);

		//Typing Indicator Logic

		if (!socketConneted) return;

		if (!typing) {
			setTyping(true);
			socket.emit('typing', selectedChat._id);
			return;
		}

		const lastTypingTime = new Date().getTime();
		const timer = 3000;

		setTimeout(() => {
			const timeNow = new Date().getTime();
			const timeDifference = timeNow - lastTypingTime;

			if (timeDifference >= timeNow && typing) {
				socket.emit('stop typing', selectedChat._id);
				setTyping(false);
			}
		}, timer);
	};

	const fetchMessages = async () => {
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(
				`/api/message/${selectedChat._id}`,
				config
			);

			setMessages(data);

			socket.emit('join chat', selectedChat._id);
			setLoading(false);
		} catch (error) {
			toast({
				title: 'Error Occured',
				description: 'Failed to fetch messages',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		}
	};

	const sendMessage = async (event) => {
		if (!selectedChat) return;
		if (event.key === 'Enter' && newMessage) {
			socket.emit('stop typing', selectedChat._id);

			try {
				const config = {
					headers: {
						'Content-type': 'application/json',
						Authorization: `Bearer ${user.token}`,
					},
				};

				setNewMessage('');

				const { data } = await axios.post(
					'/api/message',
					{
						msg: newMessage,
						chatId: selectedChat._id,
					},
					config
				);

				// const response = await fetch('/api/message', {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-type': 'application/json',
				// 		Authorization: `Bearer ${user.token}`,
				// 	},
				// 	body: JSON.stringify({
				// 		content: newMessage,
				// 		chatId: selectedChat._id,
				// 	}),
				// });

				// const data = await response.json();

				socket.emit('new message', data);
				setMessages([...messages, data]);
			} catch (error) {
				toast({
					title: 'Error Occured',
					description: 'cant send message',
					status: 'error',
					duration: 5000,
					isClosable: true,
					postion: 'bottom',
				});
			}
		}
	};

	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit('setup', user);

		socket.on('connected', () => {
			setSocketConnected(true);
		});

		socket.on('typing', () => setIsTyping(true));
		socket.on('stop typing', () => setIsTyping(false));
	}, []);
	useEffect(() => {
		if (selectedChat) {
			fetchMessages();

			selectedChatCompare = selectedChat;
		}
	}, [selectedChat]);

	useEffect(() => {
		socket.on('message recieved', (newMessageRecieved) => {
			if (
				!selectedChatCompare ||
				selectedChatCompare._id !== newMessageRecieved.chat._id
			) {
				//give notification
				if (!notifications.includes(newMessageRecieved)) {
					setNotifications([newMessageRecieved, ...notifications]);

					setFetchAgain(!fetchAgain);
					console.log(notifications);
					return;
				}
			} else {
				setMessages([...messages, newMessageRecieved]);
			}
		});
	});

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: '28px', md: '30px' }}
						pb={3}
						px={2}
						w="100%"
						fontFamily={'Work sans'}
						display={'flex'}
						justifyContent={{ base: 'space-between' }}
						alignItems={'center'}
					>
						<IconButton
							display={{ base: 'flex', md: 'none' }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat('')}
						/>
						{!selectedChat.isGroupChat ? (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModel user={getSenderFull(user, selectedChat.users)} />
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModal fetchMessages={fetchMessages} />
							</>
						)}
					</Text>

					<Box
						display={'flex'}
						flexDir={'column'}
						justifyContent={'flex-end'}
						p={3}
						bg={'#E8E8E8'}
						w={'100%'}
						h={'100%'}
						borderRadius={'lg'}
						overflowY={'hidden'}
					>
						{loading ? (
							<Spinner
								size={'xl'}
								h={20}
								w={20}
								margin={'auto'}
								alignSelf={'center'}
							/>
						) : (
							<div className="messages">
								<ScrollableChat />
							</div>
						)}

						<FormControl onKeyDown={sendMessage} isRequired mt={3}>
							{isTyping && typing ? (
								<Lottie
									options={defaultOptions}
									width={70}
									style={
										{ marginBottom: 15, marginLeft: 0 }
									}
								/>
								// <div>Typing....</div>
							) : (
								<></>
							)}
							<Input
								variant={'filled'}
								bg={'#E0E0E0'}
								placeholder="Enter Your Message....."
								onChange={typingHandler}
								value={newMessage}
							/>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					display={'flex'}
					alignItems={'center'}
					justifyContent={'center'}
					h={'100%'}
				>
					<Text fontSize={'3xl'} pb={3} fontFamily={'Work Sans'}>
						Click on a user to start chatting
					</Text>
				</Box>
			)}
		</>
	);
}
