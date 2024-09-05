const jwt = require('jsonwebtoken')
const UserModel = require('../models/UserModel')
const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return {
            message: "Session out",
            logout: true
        }
    }
    const decode = jwt.decode(token
        .split(" ")[1]
        , process.env.JWT_SECRET_KEY)
    const user = await UserModel.findById(decode.userId).select("-password")
    return user
}

module.exports = getUserDetailsFromToken