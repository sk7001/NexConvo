const getUserDetailsFromToken = require("./helper/getUserDetailsFromToken");
const { io } = require("./index");
const { conversationModel } = require("./models/Conversation");
const UserModel = require("./models/UserModel");

io.on('connection', (socket) => {
    // Log the socket ID
    console.log(`Client connected ${socket.id}`);

    // Search for people
    socket.on('searchpeople', async (search) => {
        console.log('Searching people:', search);
        const users = await UserModel.find({
            $or: [
                { name: { $regex: '^' + search, $options: 'i' } },
                { phone: { $regex: '^' + search, $options: 'i' } }
            ]
        }).select("-password");
        socket.emit('searchresult', users);
    });

    //getfriends
    socket.on("getfriends", async (token) => {
        const user = await getUserDetailsFromToken(token)
        const friends = await UserModel.find({
            // $or: [
            //     { receiver: user._id },
            //     { sender: user._id }
            // ]
            _id:{$ne:user._id }
        }).sort("name")
        // const friendarray = []
        // friends.map((friend) => {
        //     if (friend.receiver === user._id) {
        //         const sender = UserModel.findOne({ _id: friend.sender })
        //         friendarray.push(sender)
        //     }
        //     else {
        //         const receiver = UserModel.findOne({ _id: friend.receiver })
        //         friendarray.push(receiver)
        //     }
        // })
        // console.log(friendarray)
        // const activeFriendarray = []
        // friendarray.map((friend)=>{
        //     const activeFriend = UserModel.find({ _id: friend })
        //     console.log(activeFriend)
        // if (activeFriend) {
        //     activeFriendarray.push(activeFriend)
        // }
        // })
        // friends.receiver == user._id ? friend.push(friends.sender) : friend.push(friends.receiver)
        // console.log(activeFriendarray)
        socket.emit("friends", friends)

    })


    //startchat
    socket.on("startchat", async (id, token) => {
        const user = await getUserDetailsFromToken(token);
        let conversation = await conversationModel.findOne({
            $or: [
                { sender: user._id, receiver: id },
                { sender: id, receiver: user._id }
            ]
        }).populate("messages");

        if (!conversation) {
            conversation = new conversationModel({ sender: user._id, receiver: id });
            await conversation.save();
        }

        socket.emit("messageshistory", conversation.messages);
    });


    //get
});
