const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken")
const UserModel = require("../models/UserModel")

const updateUserDetails = async (req, res) => {
    try {
        const token = req.body.headers.Authorization
        const user = await getUserDetailsFromToken(token)
        const { name, email, profile_pic } = req.body.userDetails
        await UserModel.updateOne({
            _id: user._id,
            $set: {
                name: name,
                email: email,
                profile_pic: profile_pic
            }
        })
        return res.status(200).json({ message: "Details updated successfully" })
    } catch (error) {
        return res.status(400).json({ message: "Something went wrong please try again" })
    }
}

module.exports = updateUserDetails