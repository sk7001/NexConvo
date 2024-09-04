const UserModel = require("../models/UserModel");

const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const checkEmail = await UserModel.findOne({ email }).select("-password");
        if (!checkEmail) {
            return res.status(400).json({ message: "User with this email doesn't exist." })
        }
        return res.status(200).json({
            message: `Please enter your password ${checkEmail.name}`,
            checkEmail

        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = checkEmail