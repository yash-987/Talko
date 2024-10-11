import { ViewIcon } from "@chakra-ui/icons"
import { Box, Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react"
import PropTypes from 'prop-types'


export default function ProfileModel({user,children}) {
    const { isOpen, onClose, onOpen } = useDisclosure()

  return (
      <>
      
          {children ? (
              <span onClick={onOpen}>{children}</span>
          ) : (
                  <IconButton display={{ base:'flex'}} icon={<ViewIcon/>} onClick={onOpen}/>
          )}



          <Modal
              size={'lg'}
              isCentered
              isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent
              h={'410px'}
              >
                  <ModalHeader
                      fontSize={'40px'}
                      fontFamily={'Work Sans'}
                      display={'flex'}
                      justifyContent={'center'}
                  
                  >
                      {user.name}
                  </ModalHeader>
                  <ModalCloseButton />
                  <ModalBody
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'space-between'}
                      flexDir={'column'}
                  >
                      {user.pic ?    <Image
                          borderRadius={'full'}
                          boxSize={'150px'}
                          src={user.pic }
                          
                      /> : (
                              <Box backgroundColor={'purple'} boxSize={'150px'} borderRadius={'full'} display={'flex'} alignItems={
                                  'center'
                              }  justifyContent={'center'}>
                                  <Text color={'white'}>
                                      {user.name}
                                  </Text>
                           </Box>
                      )}
                  
                      <Text
                          fontSize={{ base: '28px', md: "30px" }}
                          fontFamily={'Work Sans'}
                      >
                          Email:{user.email}
                      </Text>
                  </ModalBody>
                  <ModalFooter>
                      <Button colorScheme="blue" mr={3} onClick={onClose}>
                          Close
                      </Button>
                     
                  </ModalFooter>
              </ModalContent>
          </Modal>
      </> 
  )
}

ProfileModel.propTypes = {
    user: PropTypes.object.isRequired,
    children:PropTypes.element
}