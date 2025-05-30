import React, {useState} from 'react'
import { Button ,VStack, Input, Box, Text,InputGroup } from '@chakra-ui/react'

const Login = () => {
 const [name,setName] = useState("")
     const [password,setPassword] = useState("")
     const [show,setShow] = useState(false)
     const submitHandler=()=>{};
   return (
     <VStack spacing="5px">
             <Box id="id" isRequired>
                 <Text>아이디</Text>
                 <Input
                 placeholder="아이디를 입력하시오"
                 onChange={(e) => setName(e.target.value)}></Input>
             </Box>
             <Box id="pw" isRequired>
                 <Text>비밀번호</Text>
                 <InputGroup>
                 <Input
                 type={show ? "text" : "password"}
                 placeholder="비밀번호를 입력하시오"
                 onChange={(e) => setPassword(e.target.value)}></Input>
                  </InputGroup>
                 <Box   as="span"
                 position="absolute"
                  right="4rem"
                     top="73%"
                  transform="translateY(-50%)"
                 zIndex="1"
                 >
                 <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                     {show ? "숨기기" : "보이기"}
                 </Button>
                 </Box>
                 </Box>
                 
             <Button
                 width="100%"
                 style={{ marginTop: 15}}
                 onClick={submitHandler}
                 >
                 로그인
             </Button>
             </VStack>
   );
 };
 

export default Login