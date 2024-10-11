import { useRecoilState, useRecoilValue } from 'recoil';
import { UserAtom } from '../../store/user';
import { ChatAtom, FetchAtom, SelectedChatAtom } from '../../store/chat';
import { useEffect, useState } from 'react';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
// import axios from 'axios';
import ChatLoading from './ChatLoading';
import { getSender } from '../../config/ChatLogic';
import { GroupChatModel } from './GroupChat';
export default function MyChats() {
	const user = useRecoilValue(UserAtom);
	const [chats, setChats] = useRecoilState(ChatAtom);
	const [selectedChat, setSelectedChat] = useRecoilState(SelectedChatAtom);
	const [loggedUser, setLoggedUser] = useState(true);
      const fetchAgain = useRecoilValue(FetchAtom)
	const toast = useToast();
// console.log(chats)
	useEffect(() => {
		const fetchChats = async () => {
			// console.log('hook called of my chats');

			try {
				const response = await fetch('/api/chats', {
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${user.token}`,
					},
					method: 'GET',
				});
				const chatArray = await response.json();

				setChats(chatArray);
				
			} catch (error) {
				toast({
					title: 'Failed to fetch chats',
					description: error.message,
					status: 'error',
					duration: 3000,
					isClosable: true,
					position: 'top-left',
				});
			}
		};
		setLoggedUser(JSON.parse(localStorage.getItem('user-info')));
		fetchChats();
	}, [fetchAgain]);
	

	return (
		<Box
			display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
			flexDir={'column'}
			alignItems={'center'}
			p={3}
			bg={'white'}
			w={{ base: '100%', md: '31%' }}
			borderRadius={'lg'}
			borderWidth={'1px'}
		>
			<Box
				pb={3}
				px={3}
				fontSize={{ base: '28px', md: '30px' }}
				fontFamily={'Work sans'}
				display={'flex'}
				alignItems={'center'}
				w={'100%'}
				justifyContent={'space-between'}
			>
        My Chats
        <GroupChatModel>

				<Button
					display={'flex'}
					fontSize={{ base: '17px', md: '10px', lg: '17px' }}
					rightIcon={<AddIcon />}
				>
					New Group Chat
				</Button>
        </GroupChatModel>
			</Box>

			<Box
				display={'flex'}
				flexDir={'column'}
				p={3}
				bg={'#F8F8F8'}
				w={'100%'}
				h={'100%'}
				borderRadius={'lg'}
				overflowY={'hidden'}
      >
				{chats  ? (
		                
          <Stack overflowY={'scroll'}>
						{
						
			chats && chats.map((c) => (
			<Box
			onClick={() => setSelectedChat(c)}
			cursor={'pointer'}
			bg={selectedChat === c ? '#38B2AC' : '#E8E8E8'}
			key={c._id}
			color={selectedChat === c ? 'white' : 'black'}
			px={3}
			py={2}
			borderRadius={'lg'}
			
			>
			<Text> 
				{!c.isGroupChat ? (
				getSender(loggedUser,c.users)
				):(c.chatName)}
			</Text>

			</Box>
		)
		)
			}
            
        </Stack>

         ):(

					<ChatLoading/>,
					
		 			console.log(typeof chats)
						
        ) }
      
      </Box>
		</Box>
	);
}
