import React from 'react'
import { Container , Box, Text, Center, Tabs} from '@chakra-ui/react'
import Login from "../components/Authentication/Login"
import Register from "../components/Authentication/Register"

const Homepage = () => {
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
        <Tabs.Root>
  <Tabs.List mb="1em">
    <Tabs.Trigger value="login" width="50%">로그인</Tabs.Trigger>
    <Tabs.Trigger value="register" width="50%">회원가입</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="login">
    <Login></Login>
  </Tabs.Content>
  <Tabs.Content value="register">
    <Register></Register>
  </Tabs.Content>
</Tabs.Root>
       
        </Box>
    </Container>
  )
}

export default Homepage