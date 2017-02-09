/* By Robert Matteau
  Febuary 8th, 2017 
 Heruko Cloud Assignment
 */

var expresslib = require('express');
var pathlib = require('path');
var cookieParserlib = require('cookie-parser');
var bodyParserlib = require('body-parser');
var exphbslib = require('express-handlebars');
var expressValidator = require('express-validator');
var flashlib = require('connect-flash');
var session = require('express-session');
var passportlib = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongolib = require('mongodb');
var mongodblib = require('mongodb');
var mongooselib = require('mongoose');


//used to connect to mongo server
var MongoClient = mongodblib.MongoClient;

// mongoserver url
var url = 'mongodb://cloud:cloud@ds127948.mlab.com:27948/users1462';      


// connecting to the server
  MongoClient.connect(url, function (err, db) {
  if (err) {
    //log the connection result
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
    //Close connection
    db.close();
  }
});

//connect to the database
mongooselib.connect(url);
var db = mongooselib.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

// initialize the website
var website = expresslib();

// view the website engine
website.set('views', pathlib.join(__dirname, 'views'));
website.engine('handlebars', exphbslib({defaultLayout:'layout'}));
website.set('view engine', 'handlebars');

// parsing body of 
website.use(bodyParserlib.json());
website.use(bodyParserlib.urlencoded({ extended: false }));
website.use(cookieParserlib());

// set up a folder
website.use(expresslib.static(pathlib.join(__dirname, 'public')));

// set up the session
website.use(sessionlib({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// initialize the passport library
website.use(passportlib.initialize());
website.use(passportlib.sessionlib());

// use the validator library
website.use(expressValidatorlib({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// connect to the flash library
website.use(flashlib());

// setting up my global variables
website.use(function (req, res, next) {
  res.locals.success_msg = req.flashlib('success_msg');
  res.locals.error_msg = req.flashlib('error_msg');
  res.locals.error = req.flashlib('error');
  res.locals.user = req.user || null;
  next();
});



website.use('/', routes);
website.use('/users', users);

// set port number for local running
website.set('port', (process.env.PORT || 3000));

//logging information
website.listen(website.get('port'), function(){
  console.log('Server started on port '+website.get('port'));
});