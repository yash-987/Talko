import { Box } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import {UserAtom} from '../store/user'
import SideDrawer from '../Components/Chats/SideDrawer'
import MyChats from '../Components/Chats/MyChats'
import ChatBox from '../Components/Chats/ChatBox'
function ChatPage() {
        const user = useRecoilValue(UserAtom)
   
  
   

    
  return (
    
          <div style={{width:'100%'}}>
      {user && <SideDrawer/>}
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        w={'100%'}
        h={
        '91.5vh'
        }
        p='10px'

      >
        {user && <MyChats/>}
        {user && <ChatBox/>}
      </Box>
          </div>
          
    
      
  )
}

export default ChatPage