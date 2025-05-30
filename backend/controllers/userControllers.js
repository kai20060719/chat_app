const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const generateToken = require("../config/generateToken")

const registerUser = asyncHandler(async (req,res) =>{
  const{name, password, pic}  = req.body;

  if(!name || !password){
    res.status(400);
    throw new Error("모든 항목을 입력하시오")
  }

  const userExists = await User.findOne({ name });

  if(userExists){
    res.status(400);
    throw new Error("해당 회원은 이미 존재합니다다")
  }

  const user = await User.create({
    name,
    password,
    pic
  });

  if(user){
    res.status(201).json({
        _id: user._id,
        name: user.name,
        pic : user.pic,
        token: generateToken(user._id),
    });
    }
    else{
        res.status(400);
        throw new Error("회원가입 실패패")
    }

});

const authUser = asyncHandler(async(req,res)=>{
    const {name,password} = req.body;

    const user = await User.findOne({name});

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            pic: user.pic,
            token: generateToken(user._id),
        });
    }
    else{
        res.status(401);
        throw new Error("아이디나 비밀번호가 잘못되었습니다다")
    }
});

module.exports = {registerUser, authUser};