'use strict'
var express = require('express'), router = express.Router();
const mysql = require('mysql')
const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: '',
    database: 'test'
})



//Connect to mysql db
db.connect((err) => {
    if (err) throw ("MySQL Error:", err)
})



//create table
router.get('/', (req, res, next) => {
    let sql = "CREATE TABLE  posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(225), PRIMARY KEY (id))";
    db.query(sql, (err, result) => {
        if (err) {
            res.send(err)
            return console.log("Error", err)
        }
        return res.send("created", result)
    })
})

//post
router.get('/insert', (req, res, next) => {
    let post = {
        title: "Boston, one of my favorite cities, is in the new England area (Northeast of the US)",
        body: "My favorite city"
    }
    let sql = "INSERT INTO posts SET ?";
    db.query(sql, post, (err, result) => {
        if (err) return res.send(err);
        res.send(result)
    })
})

//get data
router.get('/select', (req, res, next) => {
    let sql = "SELECT * FROM posts";
    db.query(sql, (err, result) => {
        if (err) throw (err);
        res.send(result)
    })
})


//get data with id 
router.get('/select/:id', (req, res, next) => {
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) throw (err);
        res.send(result)
    })
})



//update data
router.get('/update/:id', (req, res, next) => {
    let newTitle = "Updated post";
    let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) throw (err);
        res.send(result)
    })
})


//delect data
router.get('/delete/:id', (req, res, next) => {
    let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) throw (err);
        res.send(result)
    })
})









module.exports = router