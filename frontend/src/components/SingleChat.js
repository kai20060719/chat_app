import React, { useState, useEffect, use, useRef } from 'react'
import { ChatState } from "../Context/ChatProvider";
import { Box, FormControl, Icon, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./UserAvatar/styles.css"; 
import ScrollableChat from './ScrollableChat';
import { io } from "socket.io-client";
import Lottie from "react-lottie";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;


const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const { user, selectedChat, setSelectedChat } = ChatState();

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeout = useRef(null);

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: require('../animations/typing.json'),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

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
        
        setMessages(data);
        setLoading(false);

        socket.emit("join chat", selectedChat._id);

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
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));

      return () => {
        socket.off("typing");
        socket.off("stop typing");
        socket.disconnect();
      };
    }, []); 

    useEffect(() => {
      fetchMessages();

      selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
      socket.on("message received", (newMessageReceived) => {
        if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
          // ..
        } else {
          setMessages([...messages, newMessageReceived]);
        }
      })
    }
    );
    
    const sendMessage = async(event) => {
        if (event.key === "Enter" && newMessage) {
          socket.emit("stop typing", selectedChat._id);
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

            socket.emit("new message", data);
            setMessages([...messages, data]);
          } catch (error) {
            toast({
              title: "에러 발생!",
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
      if (!socketConnected) return;
      if (!typing) {
        setTyping(true);
        socket.emit("typing", selectedChat._id);
      }

      
      if (typingTimeout.current) clearTimeout(typingTimeout.current);

      
      typingTimeout.current = setTimeout(() => {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }, 3000);
    };

    
    


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
          mt={3}
          >
            
            {isTyping && selectedChat && selectedChat.users.find(u => u._id !== user._id) && (
              <div>
                <Lottie
                width={70}
                options={defaultOptions}
                style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>
            )}
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