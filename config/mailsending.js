var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.get('/mailsending', function (req, res) {
    res.render('mailsending.ejs', { title: 'Mail Sending', message: req.flash('success') });
})

router.post('/mailsending', function (req, res) {
    // before adding mail sending code check on this (Less secure app access) security
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pridevelbizsol@gmail.com',
            pass: 'vMveXN32NR{mr'
        },
        tls: {
            rejectUnauthorized:false
        }
    });
    // setup email data with unicode symbols
    let mailOptions = {
        from: 'pridevelbizsol@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: req.body.subject, // Subject line
        html: req.body.message // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Mail sent succesfully!");
        // sucessMessage = "Succesfully! Your account has been created.";
        req.flash('success', 'Mail sent succesfully!');
        res.render('mailsending.ejs', { title: 'Mail Sending', message: req.flash('success') });
    });

    
})

module.exports = router;