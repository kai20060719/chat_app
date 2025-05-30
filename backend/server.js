const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require('./routes/userRoutes');
const {notFound, errorHandler} = require("./middleware/errorMiddleware")


const app = express();
dotenv.config();
connectDB();

app.use(express.json());

app.get('/', (req, res) =>{
res.send("문제x 굿굿굿");
});

app.use('/api/user',userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(5000, console.log(`성공! - ${PORT}`));