import React, { useState, useEffect } from 'react'
import { ChatState } from "../Context/ChatProvider";
import { Box, FormControl, Icon, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./UserAvatar/styles.css"; 
import ScrollableChat from './ScrollableChat';


const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const { user, selectedChat, setSelectedChat } = ChatState();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");

    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          setLoading(true);
          const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
          console.log(messages);
          setMessages(data);
          console.log(data); // ← 이렇게 해야 새로 받아온 메시지 목록이 콘솔에 찍힘
          setLoading(false);

        } catch (error) {
          toast({
            title: "에러 발생!",
            description: "메시지 불러오기 실패",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);

          
        }



    }
    useEffect(() => {
      fetchMessages();
    }, [selectedChat]);
    
    const sendMessage = async(event) => {
        if (event.key === "Enter" && newMessage) {
          try {
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            setNewMessage("");
            const { data } = await axios.post("/api/message", {
              content: newMessage,
              chatId: selectedChat._id,
            }, config);

            console.log(data);

            
            setMessages([...messages, data]);
          } catch (error) {
            toast({
              title: "에러 발생생!",
              description: "메세지 전송에 실패했습니다.",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
            
          }
        }
    };
    
    const typingHandler = (e) => {
      setNewMessage(e.target.value);
    };

    useEffect(() => {
      const fetchMessages = async () => {
        if (!selectedChat) return;
        setLoading(true);
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
          setMessages(data);
          setLoading(false);
        } catch (error) {
          toast({
            title: "메시지 불러오기 실패",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
      };

      fetchMessages();
    }, [selectedChat]);



    return (
      <>
      {selectedChat ? (
        <>
        <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
        >
          <IconButton
          display={{ base: "flex", md: "none" }}
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat("")}
          />
          {!selectedChat.isGroupChat ? (
            <>
            {getSender(user, selectedChat.users)}
            <ProfileModal user={getSenderFull(user, selectedChat.users)}/>
            </>
          ) : (
            <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModal 
              fetchAgain={fetchAgain} 
              setFetchAgain={setFetchAgain}
              fetchMessages = {fetchMessages}/>
            </>
          )}

        </Text>
        <Box
        display="flex"
        flexDir="column"
        justifyContent="flex-end"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        >
          {loading ? (
          <Spinner
          size="xl"
          w={20}
          h={20}
          alignSelf="center"
          margin="auto"
          />):(
            <div className='messages'>
            <ScrollableChat messages={messages} />
          
          </div>)}
          <FormControl 
          onKeyDown={sendMessage}
          isRequired
          mt={3}>
            <Input
            variant={"filled"}
            bg="#E0E0E0"
            placeholder="메세지를 입력하시오"
            onChange={typingHandler}
            value={newMessage}
            />
            
          </FormControl>
          
        </Box>
        </>
      ) : (
        <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100%"
        >
        <Text fontSize="3xl" pb={3} >
            대화를 시작할 상대를 선택하세요
                </Text>
                </Box>
      )}
      </>
    )
}


export default SingleChat