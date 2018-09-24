var LocalStrategy = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');
var dbconfig = require('./database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

module.exports = function (passport) {

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		connection.query("SELECT * FROM users WHERE id = ? ", [id], function (err, rows) {
			done(err, rows[0]);
		});
	});

	// Signup insert fuction =======================================================
	passport.use(
		'local-signup',
		new LocalStrategy({

			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true
		},
			function (req, username, password, done) {

				connection.query("SELECT * FROM users WHERE username = ?", [username], function (err, rows) {
					if (err)
						return done(err);
					if (rows.length) {
						return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
					} else {
						var created_today = new Date();
						// var today_date = dateFormat(created_today, "yyyy-mm-dd-h-MM-ss")

						var newUserMysql = {
							username: username,
							firstname: req.body.firstname,
							lastname: req.body.lastname,
							password: bcrypt.hashSync(password, null, null),
							email: req.body.email,
							gender: req.body.gender,
							agreement: Boolean(req.body.agreement),
							created_at: dateFormat(created_today, "yyyy-mm-dd-h-MM-ss")
						};

						var insertQuery = "INSERT INTO users (username, firstname, lastname, password, email, gender, agreement, created_at) values (?, ?, ?, ?, ?, ?, ?, ?)";

						connection.query(insertQuery, [newUserMysql.username, newUserMysql.firstname, newUserMysql.lastname, newUserMysql.password, newUserMysql.email, newUserMysql.gender, newUserMysql.agreement, newUserMysql.created_at], function (err, rows) {
							newUserMysql.id = rows.insertId;

							return done(null, newUserMysql);
						});
					}
				});
			})
	);
	// Login fuction =======================================================
	passport.use(
		'local-login',
		new LocalStrategy({

			usernameField: 'username',
			passwordField: 'password',
			passReqToCallback: true
		},
			function (req, username, password, done) {
				connection.query("SELECT * FROM users WHERE username = ?", [username], function (err, rows) {
					if (err)
						return done(err);
					if (!rows.length) {
						return done(null, false, req.flash('loginMessage', 'No User found.'));
					}


					if (!bcrypt.compareSync(password, rows[0].password))
						return done(null, false, req.flash('loginMessage', 'worng password.'));

					return done(null, rows[0]);
				});
			})
	);
};