import { useRecoilValue } from "recoil"
import { MessagesAtom } from "../../store/msg"
import ScrollableFeed from 'react-scrollable-feed'
import { isLastSender, isSameSender, isSameSenderMargin, isSameUser } from "../../config/ChatLogic"
import { UserAtom } from "../../store/user"
import { Avatar, Tooltip } from "@chakra-ui/react"

export default function ScrollableChat() {
  const messages = useRecoilValue(MessagesAtom)
  const user = useRecoilValue(UserAtom)
  
 console.log(messages)
  return (
      <ScrollableFeed>
          {messages && messages.map((m, i) => (
              <div key={m._id} style={{ display: 'flex' }}>
              {(isSameSender(messages, m, i, user._id) || isLastSender(messages, i, user._id) )&& 
                (<Tooltip label={m.sender.name}
                  placement="bottom-start"
                  hasArrow>
                  <Avatar
                    mt={'7px'}
                    mr={1}
                    size={'sm'}
                    cursor={'pointer'}
                    src={m.sender.pic}
                  />

                </Tooltip>
             ) }
              <span style={{
                backgroundColor: `${m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"}`,
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth:'75%',
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages,m,i,user._id)? 3:10

              }}
               
               
              >
                {m.content}
              </span>
              
              </div>
          ))}
    </ScrollableFeed>
  )
}
