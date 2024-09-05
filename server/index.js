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
    console.log(`Client connected ${socket.id}`);

    socket.on('sendMessage', (message) => {
        console.log('Message received:', message);
    });
})
server.listen(PORT, async () => {
    await connectDB()
    console.log(`server is running on port ${PORT}`)
})