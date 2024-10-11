import { Box } from "@chakra-ui/react"
import PropTypes from 'prop-types'
import {CloseIcon} from '@chakra-ui/icons'
const UserBadgeItem = ({user,handleFunction}) => {
    return (
        <Box px={2} py={1} borderRadius={'lg'} m={1} mb={2} variant={'solid'} fontSize={14} backgroundColor={'blue'} color={ 'white'} cursor={'pointer'} onClick={handleFunction}
      >
          
          {user.name}
          <CloseIcon pl={1}/>
      </Box>
  )
}


UserBadgeItem.propTypes = {
    user: PropTypes.object.isRequired,
    handleFunction:PropTypes.func.isRequired
}
export default UserBadgeItem