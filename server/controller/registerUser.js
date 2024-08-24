const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");

const registerUser = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, password, profile_pic } = req.body;
        const checkEmail = await UserModel.findOne({ email });
        if (checkEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        //hashpassword
        const hashedPassword = await bcryptjs.hash(password, 10);
        console.log(hashedPassword)
        const user = new UserModel({
            name: name,
            email: email,
            password: hashedPassword,
            profile_pic: profile_pic
        });
        console.log(user)
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error creating user", error });
    }
}

module.exports = registerUser