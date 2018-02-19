var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var cors = require('cors');
var User = require('./models/user');
const routes = require('./routes/index');


// invoke an instance of express application.
const app = express();

// set our application port
//app.set('port', 3000);

//allow cross domain
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

var cors=require('cors');

app.use(cors({origin:["http://localhost:8100"],credentials: true}));

//app.use(allowCrossDomain);

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 6000000
    }
}));

function authChecker(req, res, next) {
    // if (req.session.auth || req.path==='/login') {
    //     next();
    // } else {
    //    res.redirect("/login");
    // }
    if ((req.session.user && req.cookies.user_sid)||req.path==='/login') {
        next();
    } else {
        next();
    }    
}

//app.use(authChecker);
app.use('/', routes);


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};


// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});

module.exports = app;
//var options;
//http.createServer(app).listen(80);
//https.createServer(options, app).listen(443);
// start the express server
//app.set('port', process.env.PORT || 3000);
//app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));
