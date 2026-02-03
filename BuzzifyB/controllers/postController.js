const express = require("express");
const mongoose = require('mongoose');
const postmodel = require("../models/postModel");
const userModel = require("../models/userModel");
const cloudinary = require("../config/cloudnary");

exports.createPost = async (req, res) => {
    // here i direct use data form the frontend i am not using islogon here.
    const { caption } = req.body;
    const image = req.file;
    if (!image || !caption) {
        return res
            .status(400)
            .json({ msg: "All fields are required", success: false });
    }
    const user = await userModel.findOne({ email: req.user.email });//logon user
    const base64 = Buffer.from(image.buffer).toString("base64");
    const file = `data:${image.mimetype};base64,${base64}`;

    // // cloudnary upload
    const result = await cloudinary.uploader.upload(file, {
        folder: "uploads",
    });
    // console.log(result.secure_url,result);

    const newpost = await postmodel.create({
        user: user._id,
        image: result.secure_url,
        image_public_id: result.public_id,
        caption,
    })
    user.posts.push(newpost._id)
    await user.save();
    res.status(200).json({ msg: "upload a post", success: true });
}


// delete post
exports.deletepost = async (req, res) => {
    const { email } = req.user;
    const { postId } = req.params;
    const post = await postmodel.findById(postId);
    //some checks
    if (!postId) {
        return res.status(400).json({ msg: "post id is required", success: false });
    }
    // is user can delete this post
    const user = await userModel.findOne({ email }).select("posts _id");
    if (!user) {
        return res.status(404).json({ msg: "user not found", success: false });
    }
    if (!user.posts.includes(postId)) {
        return res.status(403).json({ msg: "you are not allowed to delete this post", success: false });
    }
    //delete image from cloudinary
    await cloudinary.uploader.destroy(post.image_public_id);
    //also delete post from postmodel
    await post.deleteOne();
    user.posts.pull(postId);
    await user.save();
    res.status(200).json({ msg: "post deleted", success: true, });
}

// get all posts

exports.getallposts = async (req, res) => {
    const posts = await postmodel.find().select("-updatedAt -__v").populate({
        path: "user",
        select: "name profilePic _id"
    }).populate({
        path: "comments.user",
        select: "name profilePic"
    })// is needed to show liked user then we can populate here {likes.user}
        .sort({ createdAt: -1 });
    res.status(200).json({ msg: "fetched all posts", posts, success: true })
}

// save post
exports.saveOrUnsavePost = async (req, res) => {
    const { email } = req.user;
    const { postId } = req.params;
    if (!postId) {
        return res.status(400).json({ msg: "post id is required", success: false });
    }
    const user = await userModel.findOne({ email }).select("saved _id");
    if (!user) {
        return res.status(404).json({ msg: "user not found", success: false });
    }
    // check if already saved and save or unsave by checking

    if (user.saved.includes(postId)) {
        user.saved.pull(postId);
        await user.save();
        return res.status(200).json({ isSaved: false, success: true });
    }
    else {
        user.saved.push(postId);
        await user.save();
        return res.status(200).json({ isSaved: true, success: true });
    }
}
// Like post
exports.LikeOrUnlikePost = async (req, res) => {
    const postId = req.params.id;
    const logonUser = req.user.id;
    const post = await postmodel.findById(postId);
    if (!postId || !post) return res.status(404).json({ msg: "something went wrong", success: false });
    if (post.likes.includes(logonUser)) {
        post.likes.pull(logonUser);
        post.save();
        res.status(200).json({ msg: "UnlikePost", islike: false, success: true })
    }
    else {
        post.likes.push(logonUser);
        post.save();
        res.status(200).json({ msg: "likePost", islike: true, success: true })
    }
}
//comment post 
exports.commentPost = async (req, res) => {
    const postId = req.params.id;
    const logonUser = req.user.id;
    const { text } = req.body;
    const post = await postmodel.findById(postId).select('-updatedAt -__v')
    if (!post || !text || !postId) return res.status(404).json({ msg: "something went wrong", success: false });
    const newcomment = {
        user: logonUser,
        text
    }
    post.comments.push(newcomment);
    post.save();
    await post.populate([{ path: "comments.user", select: "name profilePic" }, { path: 'user', select: "name profilePic" }]);
    res.status(200).json({ msg: "new comment created !", success: true, post });
}