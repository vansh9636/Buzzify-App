const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true,select:false },
    profilePic: { type: String, default: "https://res.cloudinary.com/dzdzsigav/image/upload/v1769009682/default_avatar_m0wzw4.jpg" },
    bio: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
