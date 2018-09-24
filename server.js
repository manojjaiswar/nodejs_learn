var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = express();
var nodemailer = require('nodemailer');
var path = require('path')
var port = process.env.PORT || 8080;

var passport = require('passport');
var flash = require('connect-flash');

require('./config/passport.js')(passport);
var mailsending = require('./config/mailsending.js');

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('view engine', 'ejs'); // set up ejs for templating
app.use(express.static(__dirname + '/public'));

// session store on database--------------------------------------------
var MySQLStore = require('express-mysql-session')(session);
var options = {
    'host': 'localhost',
    'user': 'root',
    'password': 'manojSql111!$#',
    'database': 'mysamples'
};
var sessionStore = new MySQLStore(options);
app.use(session({
    secret: 'kodizimcomisrunning',
    resave: false,
    store: sessionStore,
    saveUninitialized: false
})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
app.use('/', mailsending)

// launch ======================================================================
app.listen(port);
console.log('Server Running: ' + port); 