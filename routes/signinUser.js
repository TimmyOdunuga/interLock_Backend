'use strict'
var express = require('express'), router = express.Router();
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')



const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'test'
})


dotenv.config();
const jwt_sign = process.env.JWT_SIGN



//Create user
router.post('/', async (req, res, next) => {
    let error = new Error

    //get user data from request body
    var { email, password } = req.body

    try {
        //check for request body data
        if (email == '' || password == '') {
            error.message = "check request body data"
            throw ({ error: error })
        }


        let sql = `SELECT * FROM users WHERE email = "${email}"`;


        await db.query(sql, (err, result) => {
            if (err) {
                return res.send(err);
            }
            if (result.length == 0) {
                error.message = 'Wrong email/password, or user does not exist'
                return res.json({ error: error })
            }
            //compare password
            return bcrypt.compare(password, result[0].password, (errr, snap) => {
                if (snap) {

                    let user = {
                        fullName: result[0].fullName,
                        email: result[0].email,
                        uid: result[0].uid
                    }

                    //create user session token
                    const token = jwt.sign({ user }, jwt_sign, {
                        expiresIn: 50000
                    })

                    //response 
                    res.json({ user: user, authToken: token })

                } else {
                    error.message = 'Wrong email/password, or user does not exist'
                    res.json({ error: error })
                }
            })

        })

    } catch (error) {
        res.send(error)
    }
})



module.exports = router