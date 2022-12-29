require('dotenv').config()
const express = require('express')
const socketIO = require('socket.io')
const axios = require('axios')
const PORT = process.env.PORT || 3000
const app = express().listen(PORT, () => {
    console.log(`listenng to port ${PORT}`)
})

const socketHandler = socketIO(app)
socketHandler.on("connection", (socket) => {

    socket.on("disconnect", () => {
        console.log("connect disconnected")
    })
})

const priceCommend = (() => {
    axios.get(process.env.SECRET_URI)
    .then((response) => {
        const priceList = response.data.data.map((item) => {
            return {
                id:item.id,
                name: item.symbol,
                price: item.metrics.market_data.price_usd
            }
        })
        // console.log(priceList)
        socketHandler.emit("cryto", priceList)
    }).catch(err => {
        console.log(err)
    })
})

   setInterval(() => {
    priceCommend()
    }, 5000)