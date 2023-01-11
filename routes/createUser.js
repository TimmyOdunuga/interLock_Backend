'use strict'
var express = require('express'), router = express.Router();
const UIDGenerator = require('uid-generator');
const newUid = new UIDGenerator(256);
const dotenv = require('dotenv');
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'test'
})

dotenv.config();
const saltRounds = 15
const jwt_sign = process.env.JWT_SIGN


//Connect to mysql db
db.connect((err) => {
    if (err) console.log("MySQL Error:", err)
})



//create user table
router.get('/createusertable', async (req, res, next) => {
    let sql = 'CREATE TABLE  users (id int AUTO_INCREMENT NOT NULL, uid VARCHAR(44) NOT NULL PRIMARY KEY, fullName VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password CHAR(65) NOT NULL, created TIMESTAMP NOT NULL ,INDEX(id))';
    await db.query(sql, (err, result) => {
        if (err) {
            res.send(err)
            return console.log("Error", err)
        }
        return res.send(result)
    })
})






//Create user
router.post('/', async (req, res, next) => {
    let error = new Error

    //create uid
    var uid = newUid.generateSync();

    //get user data from request body
    var { fullName, email, password } = req.body

    //check for request body data
    if (!fullName || !email || !password) {
        error.error = "request body parser"
        error.message = "check request body data"
        return res.send(error)
    }

    //check if user already exit
    const query = `SELECT * FROM users WHERE email = "${email}"`

    await db.query(query, (err, result) => {
        try {
            if (err) throw (err);
            if (result.length > 0) {
                let error = new Error
                error.message = "User already exist"
                throw (error)

            } else {
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        throw (err)
                    }

                    const user = {
                        fullName: fullName,
                        uid: uid,
                        email: email,
                        password: hash
                    }

                    // create session token
                    const token = jwt.sign(user, jwt_sign, {
                        expiresIn: 50000
                    })

                    let sql = "INSERT INTO users SET ?";
                    return db.query(sql, user, (err, result) => {
                        if (err) {
                            throw (err)
                        }
                        res.json({ result, user: { fullName, uid, email }, authToken: token })
                    })

                })
            }

        } catch (err) {
            res.send({ error: err })
        }

    })

})















module.exports = router