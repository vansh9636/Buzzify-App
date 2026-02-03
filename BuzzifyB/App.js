const express = require('express')
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser");
const connection = require("./config/dbConnection");
require('dotenv').config()

// connect to database
connection();

//routers
const userRouter = require("./routes/userRouter");

//middleweres
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    { origin: "http://localhost:5173", credentials: true }
));
app.use(cookieParser());

//use router
app.use("/user", userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})