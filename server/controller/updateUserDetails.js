const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken")
const UserModel = require("../models/UserModel")

const updateUserDetails = async (req, res) => {
    try {
        const token = req.cookies.token
        const user = await getUserDetailsFromToken(token)
        const { name, profile_pic } = req.body
        const updatedUser = await UserModel.updateOne({
            _id: user._id,
            $set: {
                name: name,
                profile_pic: profile_pic
            }
        })
        const userInformation = await UserModel.findById(user._id)
        res.status(200).json({ message: "User updated successfully", userInformation })
    } catch (error) {
        res.status(400).json({ error })
    }   
}

module.exports = updateUserDetails