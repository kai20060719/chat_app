import React, {useState} from 'react'
import { Button ,VStack, Input, Box, Text,InputGroup } from '@chakra-ui/react'
import { toaster } from "../../ui/toaster";
import axios from 'axios';
import {useHistory} from "react-router-dom";

const Login = () => {
 const [name,setName] = useState("")
     const [password,setPassword] = useState("")
     const [show,setShow] = useState(false)
     const [loading,setLoading] = useState(false)
     const history = useHistory();

     const submitHandler= async ()=>{
        setLoading(true);
        if(!name || !password){
            toaster.create({
                title: "항목을 다 채워주세요",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false);
              return;
        }
        try{
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data} = await axios.post("/api/user/login",{name,password},
                config
            );
            toaster.create({
                title: "로그인 성공",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              localStorage.setItem("userInfo", JSON.stringify(data));
              setLoading(false);
              history.push("./chats")
        }
        catch(error){
            toaster.create({
                title: "에러 발생",
                description: error.response.data.message,
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false);
        }
     };
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
                     top="69.5%"
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
                 isLoading={loading}
                 >
                 로그인
             </Button>
             </VStack>
   );
 };
 

export default Login