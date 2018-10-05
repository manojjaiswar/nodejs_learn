var express = require('express');
var app = express();
var router = express.Router();
var multer = require('multer')

const fileUpload = require('express-fileupload');
router.use(fileUpload());

var fs = require("fs");

var dbconfig = require('../config/database');
var mysql = require('mysql');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);


// file upload in folder-------------
/*
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, "./Images");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({ storage: Storage }).array("imgUploader", 3); //Field name and max count

router.get("/fileupload", function (req, res) {
    res.render('fileupload.ejs', { title: 'File Upload' });
});

router.post("/fileupload", function (req, res) {
    
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong!");
        }
        res.render('fileupload.ejs', { title: 'File Upload' });
    });
});

*/
// file upload in database --------------------------

router.post("/fileupload", function (req, res) {

    // console.log(req.files.sampleFile).toString('base64');

    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('./app/Images/', function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });

    // var Storage = multer.diskStorage({
    //     destination: function (req, file, callback) {
    //         callback(null, "./app/Images");
    //     },
    //     filename: function (req, file, callback) {
    //         callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    //     }
    // });

    // var upload = multer({ storage: Storage }).array("sampleFile", 1); //Field name and max count


    // upload(req, res, function (err) {
    //     if (err) {
    //         return res.end("Something went wrong!");
    //     }
    //     res.send(req.files);
    //     // console.log(req.files.sampleFile);
    // });




    // var sampleFile = req.files.sampleFile;
    // console.log(sampleFile)
    // var testStr = String(sampleFile.name)

    // var filePath = path.extname(sampleFile.name);
    // var testPath = fs.readFileSync("C:\\Users/Manoj//LearnNodeJs/nodeloginregister_v1/app/" + sampleFile.name)

    // console.log(testPath)
    // var uploadFile = {
    //     // img: fs.readFileSync("C:\\Users/Manoj//LearnNodeJs/nodeloginregister_v1/app/nevotek_logo.png"),
    //     img: fs.readFileSync("C:\\Users/Manoj//LearnNodeJs/nodeloginregister_v1/app/" + sampleFile.name),
    //     file_name: "File Name 3"
    // };

    // var query = connection.query('INSERT INTO imageblob SET ?', uploadFile, function (err, result) {
    //     if (err) console.log(err)
    //     res.render('fileupload.ejs', {
    //         title: 'fileupload'
    //     });
    // });

});


router.get('/fileupload', function (req, res) {

    var queryString = 'SELECT * FROM imageblob';
    connection.query(queryString, function (err, rows, fields) {

        res.render('fileupload.ejs', {
            title: 'File Upload',
            users: rows
        })
    });
    
});


module.exports = router;
