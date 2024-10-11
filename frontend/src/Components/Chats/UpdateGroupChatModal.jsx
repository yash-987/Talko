import { useRecoilState, useRecoilValue } from "recoil"
import { FetchAtom, SelectedChatAtom } from "../../store/chat"
import { Box, Button, ButtonGroup, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from "@chakra-ui/react"
import { ViewIcon } from "@chakra-ui/icons"
import { UserAtom } from "../../store/user"
import { useState } from "react"
import UserBadgeItem from "../UserAvatar/UserBadgeItem"
import axios from "axios"
import UserListItem from "../UserAvatar/UserListItem"


export default function UpdateGroupChatModal({fetchMessages}) {
    const [fetchAgain, setFetchAgain] = useRecoilState(FetchAtom) 
    const user = useRecoilValue(UserAtom)

    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading,setRenameLoading] = useState(false)
    const [selectedChat,setSelectedChat] = useRecoilState(SelectedChatAtom)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()

    const handleRename = async () => {
        if (!groupChatName) return
        
        try {
            setRenameLoading(true)

            const config = {
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            }

            const { data } = await axios.put('/api/chats/rename', {
                newName: groupChatName,
                chatId:selectedChat._id
            }, config)
            
            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: 'Error occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
                
            })

            setRenameLoading(false)
        }

        setGroupChatName('')
     }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) return
        
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config)
            
            console.log(data)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title: 'Error occured!',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom ',
            })
            setLoading(false)
        }
    }
    
    const handleAddUser = async (userToAdd) => {
        if (selectedChat.users.find(u => u._id === userToAdd)) {
            toast({
                title: 'User already added!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })
            return
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only group admin can add users!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })
            return
        }

      try {
          setLoading(true)
            const config = {
							headers: {
								Authorization: `Bearer ${user.token}`,
							},
          };
          const { data } = await axios.put('/api/chats/groupAdd', {
              chatId: selectedChat._id,
              userId: userToAdd._id
          },config)

          setSelectedChat(data)
          setFetchAgain(!fetchAgain)
          setLoading(false)
      } catch (error) {
          toast({
              title: 'Failed to add user!',
              description:error.response.data.message,
              status: 'error',
              duration: 5000,
              isClosable: true,
              position:'bottom'
          })
        setLoading(false)
      }

       
    }
    const handleRemove = async (userToRemove) => {
        if (!selectedChat) return
        if (selectedChat.groupAdmin._id !== user._id && userToRemove._id !== user._id) {
            toast({
                title: 'Only group admin can remove users!',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })
        return
        }

        try {
            setLoading(true)
              const config = {
                headers: {
                    Authorization:`Bearer ${user.token}`
                }
            }

            const { data } = await axios.put('/api/chats/groupRemove', {
                chatId: selectedChat._id,
                userId: userToRemove._id
            },
                config)
            
            userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)

            toast({
                title: 'User removed successfully!',
                status: 'success',
                isClosable: true,
                position: 'bottom'
                
            })

            
        } catch (error) {
            toast({
                title: 'Failed to remove user!',
                description:error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position:'bottom'
            })
            
        }
    }

  return (
      <>
          <IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen} /> 

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
              
              <ModalOverlay />
              <ModalContent>
                  <ModalHeader
                  fontSize={'35px'} fontFamily={'Work Sans'} display={'flex'} justifyContent={'center'}
                  >{selectedChat.chatName}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                      <Box w={'100%'} display={'flex'} flexWrap={'wrap'} pb={3} >
                          {selectedChat.users.map(u => (
                              <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleRemove(u)}/>
                          ))}
                      </Box>

                      <FormControl display={'flex'}>
                          <Input placeholder="Chat Name" mb={3} value={groupChatName} onChange={(e) => setGroupChatName(e.target.value)} />
                          <Button variant={'solid'} colorScheme="teal" ml={1} isLoading={renameLoading} onClick={handleRename}> Update</Button>
                    </FormControl>
                      
                      <FormControl>
                          <Input placeholder="Add User to group" mb={1} onChange={ (e)=>handleSearch(e.target.value)} />
                      </FormControl>

                      {loading ? (
                          <Spinner size={'lg'}/>
                      ) : (
                              searchResult?.map(u => (
                                  <UserListItem
                                      key={u._id}
                                      user={u}
                                      handleFunction={()=>handleAddUser(u)}
                                      
                                  />
                              ))
                      )}
                  </ModalBody>


                  <ModalFooter>
                      <Button colorScheme="red" mr={3} onClick={()=>handleRemove(user)}>
                          Leave Group
                      </Button>
                  </ModalFooter>
              </ModalContent>
          </Modal>

    </>
  )
}
