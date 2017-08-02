const express = require('express');
const router = express.Router();

const Contact = require('../models/contacts');
const User = require('../models/users');

//retrieving contacts
router.get('/contacts', (req, res, next)=>{
	Contact.find(function(err, contacts){
		res.json(contacts);
	});
});

//add contact
router.post('/contact',(req, res, next)=>{
	let newContact = new Contact({
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		email: req.body.email,
		phone: req.body.phone,
		username: req.body.username
	});

	newContact.save((err, contact)=>{
		if(err){
			res.json({msg: 'Failed to add contact', success: false});
		}
		else {
			res.json({msg: 'Contact added successfully', success: true});;
		}
	});
});

//delete contacts
router.delete('/contact/:id',(req, res, next)=>{
	Contact.remove({_id: req.params.id}, function(err, result){
		if(err) {
			res.json(err);
		}
		else {
			res.json(result);
		}
	});
});


//retrieving users
router.get('/users', (req, res, next)=>{
	User.find(function(err, users){
		res.json(users); 
	});
});

//add user
router.post('/user',(req, res, next)=>{
	let newUser = new User({
		username: req.body.username,
		password: req.body.password
	});

	if(req.body.username == null || req.body.username == "" || req.body.password == null || req.body.password == "" || req.body.confirmPassword == null || req.body.confirmPassword == "") {
		res.json({msg: "Ensure username, email, and password were provided", success: false})
	}
	else if(req.body.password != req.body.confirmPassword) {
		res.json({msg: "Passwords are not the same", success: false});
	}
	else if(req.body.password.length > 16 || req.body.password.length < 8) {
		res.json({msg: "Password must be between 8 and 16 characters", success: false});		
	}
	else {
		newUser.save((err, user)=>{
			if(err){
				res.json({msg: 'Username already exists', success: false});
			}
			else {
				res.json({msg: 'User added successfully', success: true, username: user.username });;
			}
		});
	}
});

//delete users
router.delete('/user/:id',(req, res, next)=>{
	User.remove({_id: req.params.id}, function(err, result){
		if(err) {
			res.json(err);
		}
		else {
			res.json(result);
		}
	});
});

// USER LOGIN ROUTE
// http://localhost:3000/api/authenticate
router.post('/authenticate', function(req, res) {
	User.findOne({ username: req.body.username}).select('username password').exec(function(err, user) {
		if (err) throw err;

		if(!user) {
			res.json({ success: false, message: 'Could not authenticate user' });
		} else if(user) {
			if(req.body.password) {
				var validPassword = user.comparePassword(req.body.password);
			}
			else {
				res.json({ success: false, message: 'No password provided' });
			}
			if (!validPassword) {
				res.json({ success: false, message: 'Could not authenticate password'})
			} 
			else {
				res.json({ success: true, message: 'User authenticated!', username: user.username })
			}
		}
	});
});

module.exports = router;