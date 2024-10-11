import { useRecoilState, useRecoilValue } from 'recoil';
import { SelectedChatAtom } from '../../store/chat';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';

export default function ChatBox() {
	const selectedChat = useRecoilValue(SelectedChatAtom);
	

	return (
		<Box
			display={{ base: selectedChat ? 'flex ' : 'none', md: 'flex' }}
			alignItems={'center'}
      flexDir={'column'}
      
			p={3}
			bg={'white'}
			w={{ base: '100%', md: '68%' }}
			borderRadius={'lg'}
			borderWidth={'1px'}
		>
			{/* Single chat */}
			<SingleChat />
		</Box>
	);
}
