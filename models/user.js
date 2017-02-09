/* By Robert Matteau
  Febuary 8th, 2017 
 Heruko Cloud Assignment
 */

var mongooselib = require('mongoose');
var bcryptlib = require('bcryptjs');

// Account Schema
var AccountSchema = mongooselib.Schema({
	username: {
		type: String,
		index:true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

var Account = module.exports = mongooselib.model('Account', AccountSchema);

// creating a user
module.exports.createUser = function(newUser, callback)
{

	//encrytping the information
	bcryptlib.genSalt(10, function(err, salt) 
	{

		//hashing the username
	    bcryptlib.hash(newUser.password, salt, function(err, hash) 
	    {

	        newUser.password = hash;
	        newUser.save(callback);

	    });
	});
}

//get the user by finding the name
module.exports.getUserByUsername = function(username, callback)
{

//looking for the account name
	var query = {username: username};
	Account.findOne(query, callback);

}

//get the users by the id
module.exports.getUserById = function(id, callback)
{

	Account.findById(id, callback);
}

//checking for passwords to compare
module.exports.comparePassword = function(candidatePassword, hash, callback)
{

	//encrytp the passwords
	bcryptlib.compare(candidatePassword, hash, function(err, isMatch) 
	{


    	if(err) throw err;
    	callback(null, isMatch);


	});
}