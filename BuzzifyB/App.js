const express = require('express')
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser");
const connection = require("./config/dbConnection");
const port = process.env.PORT || 8000;
require('dotenv').config()

// connect to database
connection();

//routers
const userRouter = require("./routes/userRouter");

//middleweres
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(
    { origin: ["https://buzzify-ky1nuuihq-vansh9636s-projects.vercel.app","https://buzzify-app-xi.vercel.app"], credentials: true }
));
app.use(cookieParser());
app.set("trust proxy", 1);

//use router
app.get("/", (req, res) => {
    res.send("API running...");
})
app.use("/user", userRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})