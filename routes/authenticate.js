'use strict'
var express = require('express'), router = express.Router();
const UIDGenerator = require('uid-generator');
const dotenv = require('dotenv');
const newUid = new UIDGenerator(256);
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'test'
})




dotenv.config();
const saltRounds = 15
const jwt_sign = process.env.JWT_SIGN





//send token to user
router.get('/', (req, res) => {

    //check if user 
})














module.exports = router