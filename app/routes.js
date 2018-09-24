'use strict';
var dbconfig = require('../config/database');
var mysql = require('mysql');
var moment = require('moment');
moment().format();
const nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var path = require('path')

var dateFormat = require('dateformat');
var connection = mysql.createConnection(dbconfig.connection);
// var bcrypt = require('bcrypt-nodejs');

connection.query('USE ' + dbconfig.database);

module.exports = function (app, passport, maile_sending) {
    app.get('/', function (req, res) {
        res.render('index.ejs', { title: 'Home', message: req.flash('success') });
    });

    // app.post('/', function (req, res) {
    //     res.render('index.ejs', { title: 'Home', message: req.flash('success') });
    // });

    app.get('/login', function (req, res) {
        res.render('login.ejs', { title: 'Login', message: req.flash('loginMessage') });
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }),
        function (req, res) {
            // if (req.body.remember) {
            //     req.session.cookie.maxAge = 1000 * 60 * 3;
            // } else {
            //     req.session.cookie.expires = false;
            // }
            res.redirect('/profile');
        });

    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { title: 'Signup', message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user,
            title: 'Profile',
            moment: moment
        });
    });

    app.get('/edit_user/:id', (req, res) => {
        connection.query("SELECT * FROM users WHERE id= '" + req.params.id + "'", function (err, result) {
            res.render('edit_user.ejs', {
                title: "Editing User ",
                user: result
            })
        })
    });

    app.post('/edit_user/:id', (req, res) => {

        connection.query("SELECT * FROM users", function (err, results, fields) {
            if (err) console.log(err)
            var username = req.body.username;
            var firstname = req.body.firstname;
            var lastname = req.body.lastname;
            var email = req.body.email;

            var query = "UPDATE `users` SET";
            query += " `username` = '" + username + "',";
            query += " `firstname` = '" + firstname + "',";
            query += " `lastname` = '" + lastname + "',";
            query += " `email` = '" + email + "'";
            query += " WHERE `users`.`id` = " + req.body.id + "";

            connection.query(query, function (err, result) {
                if (err) throw err;
                console.log(result.affectedRows + " record(s) updated");
                res.redirect('/allusers');
            });

        });

    })

    app.get('/delete/:id', (req, res) => {
        connection.query("DELETE FROM users WHERE id='" + req.params.id + "'", function (err, result) {
            if (err) {
                console.log(err)
            } else {
                req.flash('deleteMessage', 'Delete Row')
                res.redirect('/allusers', {message: req.flash('deleteMessage')});
            }
        })
    });


    app.get('/allusers', function (req, res) {
        connection.query("SELECT * FROM users", function (err, result, fields) {
            if (err) {
                throw err;
            } else {
                res.render('allusers', { users: result, title: 'All Users', moment: moment });
            }

        });
    });

    app.get('/logout', function (req, res) {
        req.logout();
        req.session.destroy();
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
