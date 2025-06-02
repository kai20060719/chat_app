import React, { useState } from 'react'
import { Modal, ModalOverlay, useDisclosure, ModalContent
, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useToast, 
FormControl, Input, Box
 } from '@chakra-ui/react';
 import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';



 const GroupChatModal = ({children}) => {
   const {isOpen, onOpen ,onClose} = useDisclosure();
const [groupChatName, setGroupChatName] = useState("");
const [selectedUsers, setSelectedUsers] = useState([]);
const [search, setSearch] = useState("");
const [searchResult, setSearchResult] = useState([]);   
const [loading, setLoading] = useState(false);

const toast = useToast();

const{user, chats, setChats} = ChatState();

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
const handleSubmit = async() => {
    if(!groupChatName || !selectedUsers) {
        toast({
            title: "모든 항목을 채우세요요",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        return;
    }
    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const {data} = await axios.post(
            '/api/chat/group',
            {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },
            config
        );
        setChats([data, ...chats]);
        onClose();
        toast({
            title: "그룹 채팅 생성 완료", 
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
    } catch (error) {
        toast({
            title: "그룹 채팅 생성 실패", 
            description: error.response.data,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
        });
    }
};
const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
        toast({
            title: "사용자 이미 선택됨",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
};
const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
};



    return (
        <>
    <span onClick={onOpen} >{children}</span>

    <Modal  isOpen={isOpen} onClose={onClose} >
    <ModalOverlay />
    <ModalContent>
        <ModalHeader
        fontSize="35px"
        display={"flex"}
        justifyContent="center"
        >그룹 채팅 만들기</ModalHeader>
        <ModalCloseButton />
        <ModalBody display={"flex"} flexDir="column" alignItems="center" >
         <FormControl>
            <Input 
            placeholder="채팅 이름" 
            mb={3}
            onChange={(e) => setGroupChatName(e.target.value)}/>
        </FormControl>
        <FormControl>
            <Input 
            placeholder="상대 추가" 
            mb={1}
            onChange={(e) => handleSearch(e.target.value)}/>
        </FormControl>
        <Box w="100%" display="flex" flexWrap="wrap" > 
        {selectedUsers.map(u =>
            <UserBadgeItem
            key={user._id}
            user={u}
            handleFunction={() => handleDelete(u)}
            />)
        }
        </Box>

        {loading ? <div>로딩 중...</div> : (
            searchResult?.map((user) => (
                <UserListItem 
                key={user._id} 
                user={user} 
                handleFunction={() => handleGroup(user)} 
                />
            ))
        )}
        </ModalBody>

            <ModalFooter>
                <Button colorScheme='blue' onClick={handleSubmit}>
                    채팅 생성
                </Button>
            </ModalFooter>
    </ModalContent>
    </Modal>
      </>
  );
}

export default GroupChatModal