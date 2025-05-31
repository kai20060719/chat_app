import React, { useState } from 'react'
import {ChatState} from "../../Context/ChatProvider";
import { useToast } from '@chakra-ui/react';

const ChatBox = () => {
  const [loggedUser, setLoggedUser] = useState();
  const {selectedChat, setSelectedChat, user, chats, setChats} = ChatState();
  
  const toast = useToast();
  return (
    <div>ChatBox</div>
  )
}

export default ChatBox