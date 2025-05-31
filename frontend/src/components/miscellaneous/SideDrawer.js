import React, { useState } from 'react'
import { 
  Box, Tooltip, Button, Text, Menu, MenuButton, Avatar, MenuItem, MenuList, 
  Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
  Input,useToast,
  Spinner, 
} from '@chakra-ui/react'
import { BellIcon , ChevronDownIcon} from '@chakra-ui/icons';
import {ChatState} from "../../Context/ChatProvider";
import ProfileModal from './ProfileModal';  
import {useHistory} from "react-router-dom"
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const { user , setSelectedChat,chats, setChats} = ChatState();
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const logoutHandler =  () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    }

    const toast = useToast(); 

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "검색어를 입력하세요.",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
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

        const {data} = await axios.get(`/api/user?search=${search}`, config);
        
    


        setLoading(false);
        setSearchResult(data);
       } catch (error) {
        toast({
            title: "오류 발생",
            description: "사용자를 찾을 수 없습니다.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
       }
    }

    const accessChat =  async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
                "/api/chat",
                { userId },
                config
            );
            if(!chats.find((c) =>c._id === data._id)) {
                setChats([data, ...chats]);
            }
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "오류 발생",
                description: "채팅을 열 수 없습니다.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }
  
    return (
    <>
    <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 10px 5px"
        borderWidth="5px"
        >
        <Tooltip 
        label="대화할 상대를 찾으세요"
        hasArrow
        placement="bottom-end"
        >
          <Button variant="ghost" onClick={onOpen}>찾기</Button> 
        </Tooltip>
        <Text fontSize="2xl" >채팅 앱</Text>
        <div>
            <Menu>
                <MenuButton p={1}>
                <BellIcon fontSize="2xl" m={1}/>
                </MenuButton>
                <MenuList></MenuList>
            </Menu>
            <Menu>
                <MenuButton 
                as={Button}
                rightIcon={<ChevronDownIcon/>}
                >
                    <Avatar 
                    size= "sm" 
                    cursor="pointer" 
                    name={user.name} 
                    src={user.pic}
                    />
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user}>
                    <MenuItem>내 프로필</MenuItem>
                    </ProfileModal>
                    <MenuItem onClick={logoutHandler}>로그아웃</MenuItem>
                </MenuList>  
            </Menu>
        </div>

    </Box>

    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
    <DrawerOverlay />
    <DrawerContent>
    <DrawerHeader borderBottomWidth='1px'>상대 찾기</DrawerHeader>
    <DrawerBody>
    <Box display="flex" pb={2}>
    <Input 
        placeholder='상대의 이름을 입력하세요'
        mr={2}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
    />
    <Button onClick={handleSearch}>찾기</Button>
    </Box>
    {loading ? (
        <ChatLoading /> 
    ) : (
        searchResult?.map(user => (
          <UserListItem
            key={user._id}
            user={user}
            handleFunction={() => accessChat(user._id)}
          />
        )) 
    )
    }
    {loadingChat && <Spinner ml="auto" display="flex"/>}
    </DrawerBody> 
    </DrawerContent>
    </Drawer>
    </>
  )
}

export default SideDrawer