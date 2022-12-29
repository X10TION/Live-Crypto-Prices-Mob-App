require('dotenv').config()
const express = require('express')
const socketIO = require('socket.io')
const axios = require('axios')

// https://data.messari.io/api/v1/assets/{assetKey}/metrics/market-data

const PORT = process.env.PORT || 3000
const app = express()
app.use(express.json())
const server = app.listen(PORT, () => {
    console.log(`listenng to port ${PORT}`)
})

const socketHandler = socketIO(server)
socketHandler.on("connection", (socket) => {

    socket.on("disconnect", () => {
        console.log("connect disconnected")
    })
})

const priceCommend = (() => {
    axios.get(process.env.SECRET_URI, {
        headers: {
            'x-messari-api-key': process.env.API_KEY,
        }
    })
        .then((response) => {
            const priceList = response.data.data.map((item) => {
                return {
                    id: item.id,
                    name: item.symbol,
                    price: item.metrics.market_data.price_usd
                }
            })
            // console.log(priceList)
            socketHandler.emit("cryto", priceList)
        }).catch(err => {
            console.log(err)
            socketHandler.emit("cryto", {
                error: true,
                message: "Error Fetching Price Data From API"
            });
        });
});

setInterval(() => {
    priceCommend()
}, 60000);


app.get('/cryptos/profile/:id', (req, res) => {
    const cryptosId = req.params.id;
    axios.get(`${process.env.BASE_URI_V2}/assets/${cryptosId}/profile`, {
        headers: {
            'x-messari-api-key': process.env.API_KEY,
        }
    }).then((responseData => {
        res.json(responseData.data.data)
        
    })).catch((error) => {
        res.json({
            error: true,
            message: "Error Fetching Price Data From API",
            errorDetails: error
        });
    })
    if (!cryptosId) {
        res.json({ error: true, massege: "Missing cryptos id" })
    }
    

})


app.get('/cryptos/profile', (req, res) => {
    res.json({ error: true, massege: "Broken link. please provide ID" })
})

// Market data
app.get('/cryptos/market-data/:id', (req, res) => {
    const marketId = req.params.id;
    axios.get(`${process.env.BASE_URI_V1}/assets/${marketId}/metrics/market-data`, {
        
        headers: {
            'x-messari-api-key': process.env.API_KEY,
        }
    }).then((responseData => {
        res.json(responseData.data.data)
        
    })).catch((error) => {
        res.json({
            error: true,
            message: "Error Fetching Market  Data From API",
            errorDetails: error
        });
    })
    if (!marketId) {
        res.json({ error: true, massege: "Missing Id from Market data" })
    }
    

})


app.get('/cryptos/market-data', (req, res) => {
    res.json({ error: true, massege: "Broken link for Market Data. please provide ID" })
})