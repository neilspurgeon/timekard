// REQUIRMENTS
// ==========================================================
// ==========================================================
var express      = require("express");
var app          = express();
var db           = require("./models");
var bodyParser   = require("body-parser");
var path         = require("path");
var views        = path.join(__dirname, "views");
var public       = path.join(__dirname, "public");
var jwt          = require('jsonwebtoken');
var xJwt         = require('express-jwt');
var secret       = require('./config/secret.js');
var tokenManager = require('./config/tokenManager');


app.use(express.static("bower_components"));
app.use(express.static("public/build"));
app.use(bodyParser());

app.use('/api', xJwt({secret: secret.secretToken}));

// MIDDLEWARE
// ==========================================================
// ==========================================================

app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

// ROUTES
// ==========================================================
// ==========================================================

// USER ROUTES
//============

// Create User
app.post("/users", function (req, res) {
	var user = JSON.parse(req.body.jsonStr);
	console.log(user);
	
		db.User
		.createSecure(user.email, user.password, user.passwordConfirm, user.firstName, user.lastName,
		function (err, user) {
			if (user) {
				req.login(user);
				res.send(201);
			} else {
				console.log(err.errors);
				console.log("error: email already exists");
			}
		});
});

// Log In User 
app.post("/login", function (req, res) {
  var email    = (req.body.email);
  var password = (req.body.password);

	db.User
		.authenticate(email, password,
		function (err, user) {
      if (user) {
        var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
        console.log("success");
        return res.json({token: token});
      }
      console.log("error");
      return res.send(err);
		});
});

// Log Out User
app.post("/logout", function (req, res) {
	  req.logout();
	  res.send(200);
});

// Get User Profile
app.get("/api/profile", function (req, res) {
  var user = req.user;

  db.User.findOne({
    _id: user._id
  }, function(err, user) {
    res.send(user);
  });
});

// CLIENT ROUTES
//==============

// Get Clients
app.get("/api/clients", function (req, res) {
  var user = req.user;

	db.Client.find({
		userId: user._id
	}, function (err, clients) {
			res.status(202).send(clients);
	});
});

// Create Clients
app.post("/api/clients", function (req, res) {
	var clientName = req.body.name;
	var user = req.session.userId;

	db.Client.create({
		userId: user,
		name: clientName
	}, function (err, client) {
		console.log("something " + client);
		res.send(client);
	});
});

// JOB ROUTES
// ==========

// Get Jobs
app.get("/api/clients/:id/jobs", function (req, res) {  
  db.Client.find({
		_id: req.params.id 
	}, function (err, jobs) {
			res.send(201, jobs);
	});
});

// Create Job
app.post("/api/clients/:id/jobs", function (req, res) {
	var clientId = req.params.id;
	var jobName = req.body.name;
	
	db.Client.update(
		{_id: clientId},
		{$push: {jobs: {name: jobName}}},
		function (err, success) {
			res.send(201);
		});
});

// Delete Job
app.delete("/api/jobs/:id/delete", function (req, res) {
	var jobId = req.params.id;
	var clientId = req.body.id;

	db.Client.deleteJob(jobId, clientId,
		function (err, job) {
			res.send(201);
	});
});

// Start Timing Job
app.put("/api/:clientId/jobs/:id/start", function (req, res) {
	var jobId = req.params.id;
	var clientId = req.params.clientId;
	
	db.Client.startTime(jobId, clientId,
		function (err, job) {
			if (!err) {
        return res.send(200);
      }
      return res.send(err);
	});
});

// Stop Timing Job
app.put("/api/:clientId/jobs/:id/stop", function (req, res) {
	var jobId = req.params.id;
	var clientId = req.params.clientId;

	db.Client.stopTime(jobId, clientId,
		function (err, job) {
			if (!err) {
        return res.send(200);
      }
      return res.send(err);
	});
});

// LISTEN
// ==========================================================
// ==========================================================

// LISTEN ON PORT
app.listen(process.env.PORT || 3000, function() {
	console.log("EXPRESS RUNNING...");
});
