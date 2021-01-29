const jwt = require('jsonwebtoken');
const privateKey = process.env.JWT_PRIVATE_KEY;
const statusFailed = "FAILED";

exports.auth = async (req, res, next) => {
    const header = req.header("Authorization");
    if (!header) {
        return res.status(401).json({
            status: statusFailed,
            message: "Access denied",
        });
    }

    
    try {
        const token = header.replace("Bearer ", "");
        const verified = jwt.verify(token, privateKey);
        // console.log(verified);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(401).json({
            status: statusFailed,
            message: "Invalid Token",
        });
    }
}