const UserModel = require("../models/UserModel")

const getUser = (req, res) => {
    const userId = req.body.userId
    const user = UserModel.findOne({ _id: userId })
    const userDetails = {
        name: user.name,
        profile_pic: user.profile_pic
    }
    res.status(200).json({ message: "User details sent", userDetails })
}

module.exports = getUser