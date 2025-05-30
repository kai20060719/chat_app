const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");


const app = express();
dotenv.config();
connectDB();

app.get('/', (req, res) =>{
res.send("문제x 굿굿굿");
});
const PORT = process.env.PORT || 5000;

app.listen(5000, console.log(`성공! - ${PORT}`));