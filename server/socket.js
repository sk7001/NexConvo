const getUserDetailsFromToken = require("./helper/getUserDetailsFromToken");
const { io } = require("./index");
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
        console.log(token)
        const user = await getUserDetailsFromToken(token)
        const friends = await UserModel.find({ _id: { $ne: user._id } }).sort("name")
        socket.emit("friends", friends)
    })
});
