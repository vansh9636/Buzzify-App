const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// models 
const usermodel = require("../models/userModel");
const cloudinary = require("../config/cloudnary");

//register 
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // check all fields 
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ msg: "All fields are required", success: false });
        }

        // check user is already exists or not
        const user = await usermodel.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exists", success: false });
        }

        // hash and salt with bcrypt
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) {
                    return res.status(500).json({ msg: 'server error try again after sometime', success: false });
                }

                const newuser = await usermodel.create({
                    name,
                    email,
                    password: hash
                });

                //set cookie
                const token = jwt.sign({ email, id: newuser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
                res.cookie("token", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days

                });
                res.status(201).json({ msg: "you are registered !", newuser, token, id: newuser._id, success: true });
            });
        });
    } catch (error) {
        console.log(error);
    }
}

//login 

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check all fields
        if (!email || !password) {
            return res
                .status(400)
                .json({ msg: "All fields are required", success: false });
        }

        // check user exists
        const user = await usermodel.findOne({ email }).select("+password");
        if (!user) {
            return res
                .status(400)
                .json({ msg: "Invalid credentials", success: false });
        }
        // check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ msg: "Invalid credentials", success: false });
        }
        //send userdata
        const ResUserData = await usermodel.findOne({ email }).select("-createdAt -updatedAt -__v").populate({ path: "posts", select: "-updatedAt -__v" });
        // create token
        const token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
        });
        res.status(200).json({ msg: "Login successful", ResUserData, token, success: true });

    } catch (error) {
        console.log(error);
    }
}

//get logged user data

exports.getuser = async (req, res) => {
    const { email } = req.user;
    // console.log(req.user)
    const UserData = await usermodel.findOne({ email }).select("-createdAt -updatedAt -__v").populate({ path: "posts", select: "-updatedAt -__v" });
    res.status(200).json({ msg: "fatch", UserData })
}

//get profile

exports.getprofile = async (req, res) => {
    const { userId } = req.params;
    const userprofile = await usermodel.findById(userId)
        .populate({ path: "posts", populate: [{ path: "user", select: "name profilePic" }, { path: "comments.user", select: "name profilePic" }], select: "-updatedAt -__v" })
        .populate({ path: "followers", select: "name profilePic" })
        .populate({ path: "following", select: "name profilePic" })
        .populate({ path: "saved", populate: [{ path: "user", select: "name profilePic" }, { path: "comments.user", select: "name profilePic" }] })
    return res.status(200).json({ msg: "user profile", userprofile, success: true });
}

//editprofile

exports.editprofile = async (req, res) => {
    const { email } = req.user;
    const { name, bio } = req.body;
    const profilePic = req.file;
    if (!name && !profilePic && !bio) {
        return res.status(400).json({ msg: "All fields are empty" })
    }
    const user = await usermodel.findOne({ email }).select("name profilePic bio _id");

    if (!user) {
        return res.status(404).json({ msg: "user not found", success: false })
    }

    if (name) user.name = name;
    if (profilePic) {
        // delete old pic from cloudinary
        const public_id = user.profilePic.split("/").slice(-2).join("/").split('.')[0];
        if (public_id) {
            await cloudinary.uploader.destroy(public_id);
        }
        // upload cloudnary 
        const base64 = Buffer.from(profilePic.buffer).toString("base64");
        const file = `data:${profilePic.mimetype};base64,${base64}`;
        const result = await cloudinary.uploader.upload(file, {
            folder: "uploads",
        });
        user.profilePic = result.secure_url;
    }
    if (bio) user.bio = bio;

    await user.save();
    // console.log(name, bio, profilePic);
    res.status(200).json({ msg: "edit profile", user, success: true });
}

//follower and following

exports.followOrUnfollowuser = async (req, res) => {
    const { email } = req.user;
    const { NextGuyId } = req.params;

    if (!NextGuyId) {
        return res.status(400).json({ msg: "id is required", success: false });
    }
    if (NextGuyId === req.user.id) {
        return res.status(400).json({ msg: "you cant follow yourself", success: false });
    }

    // check if user exists

    const user = await usermodel.findOne({ email });
    const followUser = await usermodel.findById(NextGuyId);
    if (!user || !followUser) {
        return res.status(404).json({ msg: "user not found", success: false });
    }
    // check if already following
    if (user.following.includes(NextGuyId)) {
        user.following.pull(NextGuyId);
        followUser.followers.pull(user._id);
        await user.save();
        await followUser.save();
        return res.status(200).json({ msg: "Unfollow", success: true });
    }
    else {
        // not following
        user.following.push(NextGuyId);
        followUser.followers.push(user._id);
        await user.save();
        await followUser.save();
        return res.status(200).json({ msg: "follow", success: true });
    }
}

exports.getalluser = async (req, res) => {
    const searchedUser = await usermodel.find().select("name profilePic");
    res.status(200).json({ msg: "get all user id ", success: true, searchedUser });
}

//logout
exports.logout = async (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ msg: "logout", success: true })
}


// middleware
// exports.islogon = (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({ msg: "", success: false });
//     }
//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ msg: "verify error", success: false });
//         }
//         // console.log(decoded)
//         req.user = decoded;
//         next();
//     });
// };


