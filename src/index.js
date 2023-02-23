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
            //data: result
            data: result[0]
        })
    } catch(err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
})

app.get("/totalActive", async (req,res) => {
    try{
        const result = await connection.aggregate([
            { $project:{"diff":{$subtract:["$infected", "$recovered"]}}},
            { $group:{_id:"total", "active":{$sum:"$diff"}} }
        ])
        res.status(200).json({
            //data: result
            data: result[0]
        })
    } catch(err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
})

app.get("/totalDeath", async (req,res) => {
    try{
        const result = await connection.aggregate([
            { $group:{_id:"total", "death":{$sum:"$death"}} }
        ])
        res.status(200).json({
            //data: result
            data: result[0]
        })
    } catch(err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
}) 

app.get("/hotspotStates", async (req,res) => {
    try{
        const result = await connection.aggregate([
            {$project:{_id:0, "state":"$state",
            "rate":[{$divide:[{$subtract:["$infected","$recovered"]},"$infected"]}]
        }}
        ])
        res.status(200).json({
            //data: result
            data: result[0]
        })
    } catch(err){
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
})




app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;