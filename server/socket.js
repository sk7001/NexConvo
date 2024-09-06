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
        const friends = await conversationModel.find({
            $or: [
                { receiver: user._id },
                { sender: user._id }
            ]
        }).sort("name")
        const friendArray = await Promise.all(friends.map(async (friend) => {
            if (friend.receiver.toString() === user._id.toString()) {
                const sender = await UserModel.findOne({ _id: friend.sender }).select("-password");
                if (!friend.messages==[]) {
                    return sender;
                }
            } else {
                const receiver = await UserModel.findOne({ _id: friend.receiver }).select("-password");
                if (!friend.messages==[]) {
                    return receiver;
                }
            }
        }));
        console.log(friendArray)
        socket.emit("friends", friendArray)

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
