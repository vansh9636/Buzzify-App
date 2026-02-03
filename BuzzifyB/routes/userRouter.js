const express = require('express');
const mongoose = require("mongoose");
// const islogon=require('../middleware/islogon');
const router = express.Router();
const {upload,islogon} = require("../middlewere/middlewere")

// controllers
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
// user router
// register 
router.post("/register", userController.register);
//login
router.post("/login", userController.login);

//getuser data
router.get("/auth/Me", islogon, userController.getuser);
// get profile
router.get("/getprofile/:userId", islogon, userController.getprofile);
// edit profile
router.put("/editprofile", islogon, upload.single('profilePic'),userController.editprofile);
// follow and unfollow
router.get("/checkfollow/:NextGuyId", islogon, userController.followOrUnfollowuser);
//for search get user id 
router.get("/getalluser", islogon, userController.getalluser);
//logout
router.get("/logout", userController.logout);

//post router 

//create post 
router.post("/createpost", islogon, upload.single('image'), postController.createPost);
// delete post 
router.delete("/deletepost/:postId", islogon, postController.deletepost);
module.exports = router;

//getallpost
router.get("/allpost", islogon, postController.getallposts);
//save and unsave post
router.get("/checksaved/:postId", islogon, postController.saveOrUnsavePost);
//like post 
router.get("/like/:id", islogon, postController.LikeOrUnlikePost)
//comment post

router.post("/commentpost/:id", islogon, postController.commentPost);