const express = require("express")
const registerUser = require("../controller/registerUser")
const checkEmail = require("../controller/checkEmail")
const checkPassword = require("../controller/checkPassword")
const userDetails = require("../controller/userDetails")
const logout = require("../controller/logout")
const updateUserDetails = require("../controller/updateUserDetails")
const getFriends = require("../controller/getFriends")

const router = express.Router()

//create user api
router.post("/register", registerUser)
//check email
router.post("/email", checkEmail)
// check password
router.post("/password", checkPassword)
//user details
router.get("/userdetails", userDetails)
//logout
router.get("/logout", logout)
//update userDetails
router.post("/updateUserDetails",updateUserDetails)
//get friends details
router.get("/friends",getFriends)

module.exports = router