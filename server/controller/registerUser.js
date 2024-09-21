const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const cloudinary = require("../helper/cloudinary")

const registerUser = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, password, phone } = req.body.user;
        const profile_pic = req.body.profilepic
        const checkEmail = await UserModel.findOne({ email });
        if (checkEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const result = await cloudinary.uploader.upload(profile_pic,
            {
                upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
                resource_type: "image",
                allowed_formats: ['png', 'jpg', 'jpeg'],
                transformation: [
                    {
                        width: 1000,
                        height: 1000,
                        crop: "limit",
                    }
                ]
            }
        )
        console.log(result)
        const user = new UserModel({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword,
            profile_pic: result.url
        });
        console.log(user)
        await user.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error creating user", error });
    }
}

module.exports = registerUser