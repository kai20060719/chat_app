const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');
const { all } = require('../routes/userRoutes');

const sendMessage = asyncHandler(async (req, res) => {
    const { chatId, content } = req.body;

    if (!chatId || !content) {
        console.error("Invalid data");
        res.status(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };
    try{
    var message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
        path: "chat.users",
        select: "name pic ",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {latestMessage: message});
    res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }


});
const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name pic")
            .populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
        
    }
})


module.exports = { sendMessage , allMessages};