import React, {useState} from 'react';
import { Button ,VStack, Input, Box, Text,InputGroup} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import {useHistory} from "react-router-dom";


const Register = () => {
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [pic,setPic] = useState("")
    const [show,setShow] = useState(false)
    const [loading,setLoading] = useState(false)
    const history = useHistory();
    const toast = useToast();

    const postDetails=(pics)=>{
        setLoading(true);
        if(pics===undefined){
            toast({
                title: "사진을 선택해주세요",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
        }

        if(pics.type ==="image/jpeg" ||pics.type ==="image/png" ){
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name","dlvyz283q");
            fetch("https://api.cloudinary.com/v1_1/dlvyz283q/image/upload",{
                method: "post",
                body: data,
            }).then((res) => res.json())
              .then(data =>{
                setPic(data.url.toString());
                setLoading(false);
              })
        }
        else{
            toast({
                title: "사진을 선택해주세요",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false);
          return;
        }

    };
    const submitHandler= async ()=>{
        setLoading(true);
        if(!name || !password){
            toast({
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
            const { data} = await axios.post("/api/user",{name,password,pic},
                config
            );
            toast({
                title: "회원가입 성공",
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
            toast({
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
                    top="55%"
                 transform="translateY(-50%)"
                zIndex="1"
                >
                <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                    {show ? "숨기기" : "보이기"}
                </Button>
                </Box>
                </Box>
                <Box id="pic">
                <Text>사진</Text>
                <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => setPic(postDetails(e.target.files[0]))}></Input>
            </Box>
            <Button
                width="100%"
                style={{ marginTop: 15}}
                onClick={submitHandler}
                isLoading={loading}
                >
                회원가입
            </Button>
            </VStack>
  );
};

export default Register