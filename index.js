;(function () {
	"use strict";

	var PORT = 3000;

	var fs = require('fs');

	var express = require('express');
	var bodyParser = require('body-parser');
	var cookieParser = require('cookie-parser');
	var expressSession = require('express-session');

	var loader = require('./loader.js');
	var config = require('./config.js');

	var app = express();

	var mongoose = require('mongoose');
	mongoose.connect('mongodb://localhost');

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(cookieParser());
	app.use(expressSession({
		secret: config.secret,
		resave: true,
		saveUninitialized: true
	}));

	var Message = mongoose.model("Message", {
		text: String,
		username: String
	});



	var users = [];
	var testUser = [{
			username: "mark",
			password: "password"
    },
		{
			username: "tyson",
			password: "password"
    },
		{
			username: "sean",
			password: "password"
    }
    ];

	for (var i = 0; i < testUser.length; i++) {
		users.push(testUser[i]);
	};

	app.get("/", function (req, res) {
		if (!req.session.username) {
			res.redirect("/login");
			return;
		}

		res.sendFile(__dirname + "/public/index.html");
	});

	app.get("/messages", function (req, res) {
		if (!req.session.username) {
			res.send("[]");
			return;
		}
		Message.find({}, "text username", function (err, data) {
			if (err) {
				res.send("[]");
				return;
			}
			res.send(JSON.stringify(data));
		});
	});

	app.post("/messages", function (req, res) {
		if (!req.session.username) {
			res.send("error");
			return;
		}

		if (!req.body.newMessage) {
			res.send("error");
			return;
		}
		var message = new Message({
			text: req.body.newMessage,
			username: req.session.username
		});
		message.save(function (err) {
			if (err) {
				res.send(err);
				return;
			}
			res.send("success");
		});
	});

	//	function messageElement(username, message){
	//		this.username = username;
	//		this.message = message
	//	}



	app.get("/login", function (req, res) {
		res.sendFile(__dirname + '/public/login.html');
		//		loader.load("users.txt", users);
	});

	function logInUser(user, pass, callback) {
		console.log("logInUser CALLED");
		User.find({
			username: user,
			password: pass
		}, "username", callback);
	}

	app.post("/login", function (req, res) {
		if (req.body.username && req.body.password) {
			logInUser(
				req.body.username, 
				req.body.password, 
				function(err, data) {
					if (err) {
						console.log("THERE WAS AN ERROR WITH YOUR USER");
						res.redirect("/login");
						return;
					}
				req.session.username = req.body.username;
				res.redirect("/");
				return;
				}
			);
		}
	});

	var User = mongoose.model("User", {
		username: String,
		password: String
	});
//	
//	function checkForUser(user, pass) {
//		User.findOne({ username: user}, "username", function(err, data) {
//			if (err) {
//				createNewUser(user, pass);
//			}
//		}):
//	}

	function createNewUser(user, pass) {
		var user = new User({
			username: user,
			password: pass
		});
		user.save(function (err) {
			if (err) {
				res.send(err);
				return;
			}
		});
		
	}
	//ADD NEW USER
	app.get('/create', function (req, res) {
		res.sendFile(__dirname + '/public/create.html');
	});

	app.post('/create', function (req, res) {
		if (req.body.username && req.body.password && req.body.pwconfirm) {
			if (req.body.password == req.body.pwconfirm) {
				createNewUser(req.body.username, req.body.password);
				res.redirect("/login");
				return;
			} else {
				res.send("Passwords don't match");
			}
		}
	});

	//				createNewUser(req.body.username, req.body.password, req.body.pwconfirm, users);
	//				req.session.username = req.body.username;
	//				loader.save(users.txt, users);
	//				res.send(users);
	//		if (username == "erty" && password == "password") {
	//			return true;
	//		} else if (username == "guest" && password == "guest") {
	//			return true;
	//		}



	//	function createNewUser(username, password, pwconfirm, users) {
	//		for (var i = 0; i < users.length; i++) {
	//			if (users[i].username == username) {
	//				return "ERROR";
	//			}
	//			if (users.indexOf(users[i].username) == -1) {
	//				var test = new newUsers(username, password, pwconfirm);
	//				users.push(test);
	//				return;
	//			}
	//		}
	//	}

	//	function newUsers(username, password, pwconfirm) {
	//		this.username = username;
	//		this.password = password;
	//		this.pwconfirm = pwconfirm;
	//	}



	//	function checkForUser(username) {
	//		User.find({
	//			username: username
	//		});
	//	}




	app.use(express.static('public'));

	app.use(function (req, res, next) {
		res.status(404);
		res.send("File not found");
	});

	app.listen(PORT, function () {
		console.log("server started on port " + PORT);
	});

}());