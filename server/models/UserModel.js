const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    profile_pic: {
        type: String
    },
    socketId:{
        type:String
    }
},
    {
        timestamps: true
    }
);


const UserModel = mongoose.model('User', UserSchema)
module.exports = UserModel