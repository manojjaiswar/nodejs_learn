var dbconfig = require('../config/database');
var mysql = require('mysql');
var dateFormat = require('dateformat');
var connection = mysql.createConnection(dbconfig.connection);
// var bcrypt = require('bcrypt-nodejs');

connection.query('USE ' + dbconfig.database);

module.exports = function (app, passport) {


    // app.get('/', function (req, res) {
    //     var row = [];
    //     var row2 = [];
    //     connection.query('select * from users where id = ?', [req.user.id], function (err, rows) {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             if (rows.length) {
    //                 for (var i = 0, len = rows.length; i < len; i++) {  
    //                     row[i] = rows[i];

    //                 }
    //             }
    //             console.log(row);

    //         }

    //         res.render('index.ejs', { rows: row }); 
    //     });
    // });

    app.get('/', function (req, res) {
        res.render('index.ejs', { title: 'Home'});
    });

    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }),
        function (req, res) {
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/profile');
        });

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

 app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {
    // console.log("Session spired")
    //  req.flash('sessionMessage', 'Session spired.')
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
    
}
