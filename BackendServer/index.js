const express = require('express')
const socketIO = require('socket.io')

const PORT = 3000 
const app = express().listen(PORT, () => {
    console.log(`listenng to port ${PORT}`)
})

const socketHandler = socketIO(app)
socketHandler.on("connection", () => {
   
    setInterval(() => {
        socketHandler.emit("cryto","Hello this is the maintance tearm")
    }, 100)
})