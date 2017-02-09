/* By Robert Matteau
  Febuary 8th, 2017 
 Heruko Cloud Assignment
 */

var expresslib = require('express');
var route = expresslib.Router();

//checking with authentication
route.get('/', Authentication, function(req, res)
{
	res.render('index');
});

//checks to see if the user is authenticated
function Authentication(req, res, next)
{
	if(req.isAuthenticated())
	{
		return next();
	} 


	else 
	{
		//if not it goes back
		res.redirect('/users/login');
	}
}

module.exports = route;