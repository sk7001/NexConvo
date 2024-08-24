const express = require("express")
const cors = require("cors")
const connectDB = require("./config/connectDB")
require("dotenv").config()
const cookieParser = require("cookie-parser")
const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
const router = require("./routes/router") 

const PORT = process.env.PORT

//api end points
app.use("/api", router)

app.listen(PORT, async () => {
    await connectDB()
    console.log(`server is running on port ${PORT}`)
})