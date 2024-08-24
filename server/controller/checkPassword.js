const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const checkPassword = async (req, res) => {
    try {
        const { password, userId } = req.body;
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const tokenData = {
            userId: user._id,
            email: user.email
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY,{ expiresIn: "1d" });
        const cookieOption = {
            http: true,
            secure: true
        }
        res.cookie("token", token, cookieOption).status(201).json({ message: `Login successful ${user.name}`, token });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = checkPassword