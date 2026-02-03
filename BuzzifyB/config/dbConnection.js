const mongoose = require('mongoose');
require('dotenv').config();
// convert into a try catch block
const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1); // if db connection fails, exit the process
    }
}
module.exports = connection;  