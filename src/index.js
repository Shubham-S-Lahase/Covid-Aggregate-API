const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const { connection } = require('./connector')

app.get("/", (req,res) => {
    res.send("Tested OK")
})

app.get("/totalRecovered", async (req,res) => {
    try{
        const result = await connection.aggregate([
            { $group : {_id:"total", "recovered":{$sum:"$recovered"}} }
        ])
        res.status(200).json({
            data: result[0]
        })
    } catch(err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
})




app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;