const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken")
const UserModel = require("../models/UserModel")

const getFriends = async (req, res) => {
    const token = req.headers.authorization
    const user = await getUserDetailsFromToken(token)
    const friends = await UserModel.find({ _id: { $ne: user._id } }).sort("name")
    res.status(200).json({ message: "User details sent", friends })
}

module.exports = getFriends