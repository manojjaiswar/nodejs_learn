var express = require('express');
var app = express();
var router = express.Router();
var multer = require('multer')
var fs = require("fs");
const fileUpload = require('express-fileupload');

app.use(fileUpload());

var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

router.post('/fileupload', function (req, res) {

    var post = req.body;
    var name = post.user_name;
    var pass = post.password;
    var fname = post.first_name;
    var lname = post.last_name;
    var mob = post.mob_no;

    // if (!req.files)
    //     return res.status(400).send('No files were uploaded.');

    var file = req.files.uploaded_image;
    var img_name = file.name;

    console.log(img_name);

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {

        file.mv('public/Images/' + file.name, function (err) {

            if (err)

                return res.status(500).send(err);
            var sql = "INSERT INTO `users_image`(`first_name`,`last_name`,`mob_no`,`user_name`, `password` ,`image`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "','" + img_name + "')";

            var query = connection.query(sql, function (err, result) {
                res.redirect('fileupload/' + result.insertId);
            });
        });
    } else {
        message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
        res.render('fileupload.ejs', { message: message, title: 'File Upload' });
    }
    res.render('fileupload', { title: 'File Upload' });

});


router.get('/fileupload', function (req, res) {

    var queryString = 'SELECT * FROM users_image';
    connection.query(queryString, function (err, rows, fields) {

        res.render('fileupload.ejs', {
            title: 'File Upload',
            users: rows
            // message: message
        })
    });


});


module.exports = router;
