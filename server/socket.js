const getUserDetailsFromToken = require("./helper/getUserDetailsFromToken");
const { io } = require("./index");
const { conversationModel, messageModel } = require("./models/Conversation");
const UserModel = require("./models/UserModel");

io.on('connection', (socket) => {
    // Log the socket ID
    console.log(`Client connected ${socket.id}`);

    //disconnect on logout button
    socket.on('logout', async (token) => {
        const user = await getUserDetailsFromToken(token)
        await UserModel.updateOne(
            { _id: user._id },
            {
                $set: {
                    socketId: null
                }
            }
        )
        console.log(`Client disconnected ${socket.id}`);
    })

    //automatic disconnect
    socket.on('disconnect', async () => {
        await UserModel.updateOne(
            { socketId: socket.id },
            {
                $set: {
                    socketId: null
                }
            }
        )
        console.log(`Client disconnected ${socket.id}`);
    });

    // Search for people
    socket.on('searchpeople', async (search) => {
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
        const user = await getUserDetailsFromToken(token);
        await UserModel.updateOne(
            { _id: user._id },
            {
                $set: {
                    socketId: socket.id
                }
            }
        );
        const conversations = await conversationModel.find({
            $or: [
                { receiver: user._id },
                { sender: user._id }
            ]
        });
        const friendIds = new Set();
        conversations.forEach(conversation => {
            if (conversation.receiver.toString() === user._id.toString()) {
                friendIds.add(conversation.sender.toString());
            } else {
                friendIds.add(conversation.receiver.toString());
            }
        });
        const friendArray = await Promise.all(Array.from(friendIds).map(async (friendId) => {
            const friend = await UserModel.findOne({ _id: friendId }).select("-password");
            return friend;
        }));
        socket.emit("friends", friendArray);
    });


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


    //send messages
    socket.on("sendmessage", async (token, receiver, messageInput) => {
        const user = await getUserDetailsFromToken(token);
        const conversation = await conversationModel.findOne({ sender: user._id, receiver: receiver })
        if (!conversation) {
            const conversation = new conversationModel({ sender: user._id, receiver: receiver });
            await conversation.save();
        }
        const newMessage = new messageModel({
            text: messageInput
        });
        await newMessage.save();
        conversation.messages.push(newMessage._id);
        await conversation.save();
        // socket.emit("newmessage", newMessage);
    });


    //get all the messages from the client
    socket.on("getmessages", async (token, receiver) => {
        const user = await getUserDetailsFromToken(token);
        const conversation = await conversationModel.find({
            $or: [
                { sender: user._id,receiver:receiver},
                { receiver: user._id, sender:receiver }
            ]
        }).populate("messages")
        console.log(conversation)
        socket.emit("messageshistory", conversation);
    });
});