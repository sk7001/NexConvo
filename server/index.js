const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

const router = require("./routes/router");

// Setup socket
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST"],
        credentials: true
    }
});

module.exports = { io, server };
require("./socket");

const PORT = process.env.PORT;

// API endpoints
app.use("/api", router);

// Start server
server.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});
