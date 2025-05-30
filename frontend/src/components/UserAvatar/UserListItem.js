import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Text, Avatar } from '@chakra-ui/react'

const UserListItem = ({user, handleFunction}) => {

  
    return (
        <Box
        onClick={handleFunction}
        cursor="pointer"
        bg="#E8E8E8"
        _hover={{
          background: "#38B2AC",
          color: "white",
        }}
        w="100%"
        d="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
        <Avatar
          mr={2}
          size="sm"
          cursor="pointer"
          name={user.name}
          src={user.pic}
        />
        <Box>
          <Text>{user.name}</Text>
        </Box>
      </Box>
  );
}

export default UserListItem