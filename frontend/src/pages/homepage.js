import React , { useEffect }from 'react'
import { Container , Box, Text, Center, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import Login from "../components/Authentication/Login"
import Register from "../components/Authentication/Register"
import {useHistory} from "react-router-dom"

const Homepage = () => {
  
   const history = useHistory();
  
      useEffect(() =>{
          const user = JSON.parse(localStorage.getItem("userInfo"));
  
          if(user){
              history.push("/chats")
          }
      }, [history]);

  return (
    <Container maxW='xl' centerContent>
        <Center
        p={3}
        bg={'black'}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        >   
    <Text fontSize="6xl" fontFamily="Work sans" color="white">채팅 앱</Text>
        </Center>
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded" colorScheme="blue">
          <TabList mb="1em">
            <Tab width="50%">로그인</Tab>
            <Tab width="50%">회원가입</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Register />
            </TabPanel>
          </TabPanels>
        </Tabs>
        </Box>
    </Container>
  )
}

export default Homepage