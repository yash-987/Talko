import {
	Box,
	Button,
	Divider,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ChatAtom } from '../../store/chat';
import { UserAtom } from '../../store/user';
import axios, { Axios } from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

export const GroupChatModel = ({ children }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [groupChatName, setGroupChatName] = useState('');
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState('');
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const toast = useToast();
	const [chats, setChats] = useRecoilState(ChatAtom);
	const user = useRecoilValue(UserAtom);

	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
			return;
		}
		try {
			setLoading(true);

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(`/api/user?search=${search}`, config);

			// const response = await fetch(`/api/user?search=${search}`, {
			// 	method: 'GET',
			// 	headers: {
			// 		Authorization: `Bearer ${user.token}`,
			// 	},
			// });

			console.log(user.token);
			// const data = await response.json();

			console.log(data);
			setSearchResult(data);
			setLoading(false);
		} catch (error) {
			toast({
				title: 'Error',
				description: error.message,
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'bottom',
			});
		}
	};

	const handleGroup = (userToAdd) => {
		if (selectedUsers.includes(userToAdd)) {
			toast({
				title: 'Error',
				description: 'User already added',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		setSelectedUsers([...selectedUsers, userToAdd]);
	};

	const handleDelete = (userToDelete) => {
		const newSelectedUsers = selectedUsers.filter(sel => sel._id !== userToDelete._id)
		
		setSelectedUsers(newSelectedUsers)
	}

	const handleSubmit = async () => {
		console.log(selectedUsers)
		if (!selectedUsers || !groupChatName) {
			toast({
				title: 'warning',
				description: 'Please fill all the fields',
				status: 'warning',
				isClosable: true,
				duration: 3000,
				position:'bottom'
				
			})
			return
		}

		try {
		
			// const response = await fetch('/api/chats/group', {
			// 	method: 'POST',
			// 	headers: {
			// 		Authorization:`Bearer ${user.token}`
			// 	},
			// 	body: {
			// 		chatName: groupChatName,
			// 		users: JSON.stringify(selectedUsers.map(u => u._id)),
			// 	}
			// })

			// const data = await response.json()

			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			const { data } = await axios.post('/api/chats/group', {
				chatName: groupChatName,
				users: JSON.stringify(selectedUsers.map(u => u._id)),
			}, config);
		  
			
			setChats([data,...chats])
			// console.log(data)
		    
			onClose() 
			

		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to create group chat',
				status: 'error',
				isClosable: true,
				position: 'bottom',
				duration:3000
			})
		}
	};
	return (
		<>
			<span onClick={onOpen}>{children}</span>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize={'35px'}
						fontFamily={'Work Sans'}
						display={'flex'}
						justifyContent={'center'}
					>
						{' '}
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody display={'flex'} flexDir={'column'} alignItems={'center'}>
						<FormControl>
							<Input
								value={groupChatName}
								placeholder="Chat Name"
								mb={3}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<Input
								onChange={(e) => handleSearch(e.target.value)}
								placeholder="Add Users eg:John,Yash,Jane"
								mb={1}
							/>
							{/* <Button onClick={()=>handleSearch(search)}>Search</Button> */}
						</FormControl>
						{/* selected users */}
						<Box  w={'100%'}  display={'flex'} flexWrap={'wrap'}>
							{selectedUsers.map((u) => (
								<UserBadgeItem
									key={u._id}
									user={u}
									handleFunction={() => handleDelete(u)}
								/>
							))}
						</Box>
						{/* render search users */}
						{loading ? (
							<div>Loading..</div>
						) : (
							searchResult?.slice(0, 4).map((u) => {
								return (
									<UserListItem
										key={u._id}
										user={u}
										handleFunction={() => handleGroup(u)}
									/>
								);
							})
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" onClick={handleSubmit}>
							CreateChat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
