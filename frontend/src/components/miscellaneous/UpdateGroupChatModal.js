import React, {useState} from 'react'
import { Icon, IconButton, Modal, ModalContent, ModalOverlay, useDisclosure, ModalHeader,ModalCloseButton
, ModalBody, ModalFooter, Button, useToast, Box,
FormControl, 
Input,
Spinner,

} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';


const UpdateGroupChatModal = ({fetchAgain, setFetchAgain}) => {
const {isOpen,onOpen,onClose} = useDisclosure();
const [groupChatName, setGroupChatName] = useState("");
const [search, setSearch] = useState("");
const [searchResult, setSearchResult] = useState([]);
const [loading, setLoading] = useState(false);
const [renameLoading, setRenameLoading] = useState(false);

const toast = useToast();

const handleRemove = async(user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
        toast({
            title: "권한 오류",
            description: "그룹 관리자만 상대를 추방할 수 있습니다.",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        return;
    }
    try {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const {data} = await axios.put(
            `/api/chat/groupremove`,
            {
                chatId: selectedChat._id,
                userId: user1._id,
            },
            config
        );
        user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
    } catch (error) {
        toast({
            title: "오류 발생",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        setLoading(false);
        
    }
}

const handleRename = async() => {

    if(!groupChatName) {
        return;
    }
    try {
        setRenameLoading(true);
        const config = {
            headers: { 
                Authorization: `Bearer ${user.token}`,
            },
        };
        const {data} = await axios.put( `/api/chat/rename`, {
            chatId: selectedChat._id,
            chatName: groupChatName,
        }, config);
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false);
    } catch (error) {
        toast({
            title: "오류 발생",
            description: error.response.data.message ,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        setRenameLoading(false);
    }
         setGroupChatName("");
}

const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
        return;
    }
        
    
    try{
        setLoading(true)
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const {data} = await axios.get(`/api/user?search=${query}`, config);
        setLoading(false);
        setSearchResult(data);
    }
    catch (error) {
        toast({
            title: "오류 발생",
            description: "사용자를 찾을 수 없습니다.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        setLoading(false);
    }

};

const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
        toast({
            title: "사용자 추가 오류",
            description: "이미 그룹에 있는 사용자입니다.",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        return;
    }
   if (selectedChat.groupAdmin._id !== user._id) {
        toast({
            title: "권한 오류",
            description: "그룹 관리자만 사용자를 추가할 수 있습니다.",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
        return;
    }

    try {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const {data} = await axios.put(
            `/api/chat/groupadd`,
            {
                chatId: selectedChat._id,
                userId: user1._id,
            },
            config
        );
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
    } catch (error) {
        toast({
            title: "오류 발생",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        setLoading(false);
        
    }
};


const {selectedChat, setSelectedChat, user} = ChatState();

  return (
    <>
    <IconButton display={{ base: "flex" }}
    icon={<ViewIcon/>}
    onClick={onOpen}
    />
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
        <ModalHeader
        fontSize="35px"
        display="flex"
        justifyContent="center"
        >
        {selectedChat.chatName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users && selectedChat.users.map(u =>
            <UserBadgeItem
            key={u._id}
            user={u}
            handleFunction={() => handleRemove(u)}
  />
)}
              
            </Box>
            <FormControl display="flex" >
                <Input
                placeholder='채팅 이름'
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                variant='solid'
                colorScheme='teal'
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
                >
                변경
                </Button>
            </FormControl>

            <FormControl display="flex">
                <Input
                placeholder='추가 할 사용자 검색'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
                />
                </FormControl>
        {loading ?
        <Spinner size ='lg' />
        : (
            searchResult?.map((user) => (
                <UserListItem
                key={user._id} 
                user={user} 
                handleFunction={() => handleAddUser(user)} 
                />
            ))
        )}

        </ModalBody>
        <ModalFooter>
          <Button onClick={() => handleRemove(user)} colorScheme='red' >
            나가기
          </Button>
          
        </ModalFooter>
        </ModalContent>
    </Modal>
    
    </>
    )
}

export default UpdateGroupChatModal