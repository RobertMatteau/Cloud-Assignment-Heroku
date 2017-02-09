/* By Robert Matteau
  Febuary 8th, 2017 
 Heruko Cloud Assignment
 */

var expresslib = require('express');
var route = expresslib.Router();
var passportlib = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');



// used for registering the user
route.post('/register', function(req, res)

{
	//set up variables
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;



	// checking to see if everythign is valid and if the passwords match
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);



	var errors = req.validationErrors();
//checks for erros
	if(errors)
	{
		
		res.render('register',
		{

			errors:errors

		});

	} 
	//else adds acccount to database
	else {


		var newAccount = new Account(
		{

			name: name,
			email:email,
			username: username,
			password: password


		});
		//creates new user
		Account.createUser(newAccount, function(err, user)
		{

			if(err) throw err;
			console.log(user);

		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

// register page
route.get('/register', function(req, res)
{

	res.render('register');

});

// login page
route.get('/login', function(req, res)
{

	res.render('login');

});

// location page
route.get('/location', function(req, res)
{

	res.render('location');

});

//uses passport library to check info
passportlib.use(new LocalStrategy(function(username, password, done) 
{

	//get the user by their name
   Account.getUserByUsername(username, function(err, user)
   {


   	if(err) throw err;
   	if(!user)
   	{

   		return done(null, false, {message: 'Unknown Account'});

   	}


   	//compares the password
   	Account.comparePassword(password, user.password, function(err, isMatch)
   	{

   		if(err) throw err;
   		//checks if match or not
   		if(isMatch)
   		{

   			return done(null, user);

   		} 

   		else {

   			return done(null, false, {message: 'Invalid password'});
   		}

   	});
   });
  }));


passportlib.serializeUser(function(user, done) 
{

  done(null, user.id);

});

passportlib.deserializeUser(function(id, done)
 {


  Account.getUserById(id, function(err, user)
   {

    done(err, user);

  });

});

//if login failes
route.post('/login', passportlib.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),function(req, res)
 {

    res.redirect('/');

  });


//loging out function
route.get('/logout', function(req, res)
{

	req.logout();

	req.flash('success_msg', 'You are logged out');

//redirect page
	res.redirect('/users/login');
});

module.exports = route;