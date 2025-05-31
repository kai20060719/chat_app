const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");
            next();
        }catch(error){
            res.status(401);
            throw new Error("권한이 없습니다. 토큰이 실패했습니다.");
        }
    }

    if(!token){
        res.status(401);
        throw new Error("권한이 없습니다. 토큰이 없습니다.");
    }

})
module.exports = {protect};