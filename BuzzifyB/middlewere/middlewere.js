const multer = require("multer");
const upload = multer();
const jwt = require("jsonwebtoken");

const islogon = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ msg: "", success: false });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: "verify error", success: false });
        }
        // console.log(decoded)
        req.user = decoded;
        next();
    });
};
module.exports = { upload, islogon };