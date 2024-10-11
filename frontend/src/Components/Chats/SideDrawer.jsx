import {
	Avatar,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Input,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Spinner,
	Text,
	Tooltip,
	useDisclosure,
	useStatStyles,
	useToast,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { UserAtom } from '../../store/user';
import ProfileModel from './ProfileModel';
import { useState } from 'react';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { ChatAtom, SelectedChatAtom } from '../../store/chat';
import { NotificationAtom } from '../../store/notifications';
import { getSender } from '../../config/ChatLogic';
import  NotificationBadge, { Effect } from 'react-notification-badge'
export default function SideDrawer() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [chats, setChats] = useRecoilState(ChatAtom);
	const [selectedChat, setSelectedChat] = useRecoilState(SelectedChatAtom);
	const [loadingChat, setLoadingChat] = useState(false);
	const { isOpen, onClose, onOpen } = useDisclosure();
	const toast = useToast();

	const [notifications,setNotifications] = useRecoilState(NotificationAtom)
	const user = useRecoilValue(UserAtom);

	const logoutHandler = () => {
		localStorage.removeItem('user-info');
		navigate('/');
	};

	const handleSearch = async () => {
		console.log('clicked');
		if (!search) {
			console.log('nothing in search');
			return toast({
				title: 'Please enter something in search',
				status: 'waring',
				duration: 5000,
				isClosabe: true,
				postion: 'top-left',
			});
		}

		try {
			setIsLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(`/api/user?search=${search}`, config);

			setIsLoading(false);
			setSearchResult(data);
		} catch (error) {
			console.log(error.message);
			toast({
				title: 'Error',
				description: error.message,
				status: 'error',
				postion: 'top-left',
				isClosable: true,
				duration: 3000,
			});
		}
	};

	const accessChat = async (userId) => {
		try {
			setLoadingChat(true);
		

			// const config = {
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 		Authorization: `Bearer ${user.token}`,
			// 	},
			// };

			// // axios method
			// const { chat } = axios.get('/api/chats', { userId }, config);
			// fetch method
			const response = await fetch('/api/chats', {
					headers: {
					"Content-Type":"application/json",
					Authorization:`Bearer ${user.token}`
				},
				method: 'POST',
				body: JSON.stringify({ userId })
			},

			)
			const chat = await response.json()
			
			setChats(chat);
			console.log('chat after api call', chats);

			if(!chats.find(c=>c._id===user._id)) setChats([chat,...chats])
			
			setSelectedChat(chat);
			setLoadingChat(false);

			onClose();
		} catch (error) {
			toast({
				title: 'Error fetching the chats',
				description: error.message,
				status: 'error',
				position: 'top-left',
				isClosable: true,
				duration: 3000,
			});
		}
	};
	return (
		<>
			<Box
				display={'flex'}
				justifyContent={'space-between'}
				alignItems={'center'}
				bg={'white'}
				w="100%"
				p={'5px 10px'}
				borderWidth={'5px'}
			>
				<Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
					<Button variant={'ghost'} onClick={onOpen}>
						<i className="fas fa-search"></i>
						<Text display={{ base: 'none', md: 'flex' }} px={4}>
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text fontSize={'2xl'} fontFamily={'Work sans'}>
					Talko
				</Text>

				<Box>
					<Menu>
						<MenuButton p={1}>
							<NotificationBadge
								count={notifications.length}
								effect = {Effect.SCALE}
							/>
							<BellIcon fontSize={'2xl'} m={1} />
						</MenuButton>
						<MenuList display={'flex'}  justifyContent={'center'}>
							{!notifications.length && "No new messages"}
							{notifications.map(n => (
								<MenuItem key={n._id} onClick={() => {
									setSelectedChat(n.chat)
									setNotifications(notifications.filter(notif=>notif!== n))
								}}>
									{n.chat.isGroupChat ? `New Message in ${n.chat.chatName}`: `New Message from ${getSender(user,n.chat.users)}`}
								</MenuItem>
							))}
						</MenuList>
					</Menu>

					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar
								size={'sm'}
								cursor={'pointer'}
								name={user.name}
								src={user.pic}
							/>
						</MenuButton>
						<MenuList>
							<ProfileModel user={user}>
								<MenuItem>My Profile</MenuItem>
							</ProfileModel>
							<MenuDivider />
							<MenuItem onClick={logoutHandler}>Logout</MenuItem>
						</MenuList>
					</Menu>
				</Box>
			</Box>

			<Drawer placement="left" onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader borderBottomWidth={'1px'}> Search Users</DrawerHeader>
					<DrawerBody>
						<Box display={'flex'} pb={2}>
							<Input
								placeholder="Search by name or email"
								mr={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button onClick={handleSearch}> Search</Button>
						</Box>
						{isLoading ? (
							<ChatLoading />
						) : (
							searchResult.map((user) => (
								<UserListItem
									user={user}
									key={user._id}
									handleFunction={() => {
										accessChat(user._id);
									}}
								/>
							))
						)}
						{loadingChat && <Spinner ml={'auto'} display={'flex'} />}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
}
