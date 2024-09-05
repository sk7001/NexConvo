const express = require("express")
const cors = require("cors")
const connectDB = require("./config/connectDB")
require("dotenv").config()
const cookieParser = require("cookie-parser")
const app = express()
app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())

const router = require("./routes/router")

const { Server } = require("socket.io")
const http = require("http")
const UserModel = require("./models/UserModel")
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
})


const PORT = process.env.PORT

//api end points
app.use("/api", router)

io.on('connection', (socket) => {
    //log the socket id
    console.log(`Client connected ${socket.id}`);
    //search for people
    socket.on('searchpeople', async (search) => {
        console.log('searching people:', search)
        const users = await UserModel.find({ email: { $regex: '^' + search, $options: 'i' } }).select("-password")
        console.log(users)
        socket.emit('searchresult', users)
    })
})
server.listen(PORT, async () => {
    await connectDB()
    console.log(`server is running on port ${PORT}`)
})