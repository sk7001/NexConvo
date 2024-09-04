const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken")

const userDetails = async (req, res) => {
    try {
        const token = req.headers.authorization
        const user = await getUserDetailsFromToken(token)
        return res.status(200).json({ message: "User Details", user })
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}
module.exports = userDetails