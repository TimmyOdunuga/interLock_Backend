'use strict';
const express = require('express');
const dotenv = require('dotenv');
const app = express()
const morgan = require('morgan')
const cors = require('cors')
var bodyParser = require('body-parser')


//routes
const createUser = require('./routes/createUser');
const signinUser = require('./routes/signinUser');
const authenticate = require('./routes/authenticate');


app.use(morgan('combined'))
dotenv.config();
const port = process.env.PORT
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())




app.get("/", (req, res, next) => {
    res.json({ message: "working" })
})

//reroute to rout files
app.use('/createuser', createUser);
app.use('/signinuser', signinUser);
app.use('/authenticate', authenticate);







//Handle 404 routes
app.get('*', (req, res) => {
    res.status(404).json({
        error: 404, message: "Route does not exist"
    })
})




app.listen(port, err => {
    if (err) return console.log("Error", err)

    console.log(`Sever starting on port ${port}`)
})