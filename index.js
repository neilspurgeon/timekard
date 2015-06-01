// REQUIRMENTS
// ==========================================================
// ==========================================================
var express = require("express"),
		app = express(),
		db = require("./models"),
		bodyParser = require("body-parser"),
		path = require("path"),
		session = require("express-session");

var views = path.join(__dirname, "views");
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.use(express.static("bower_components"));
app.use(express.static("views"));

app.use(session({
	secret: 'super secret',
	resave: false
}));

// MIDDLEWARE
// ==========================================================
// ==========================================================
app.use("/", function (req, res, next) {
	req.login = function (user) {
		req.session.userId = user._id;
	};

	req.currentUser = function (cb) {
		db.User.findOne({
			_id: req.session.userId
		},
		function (err, user) {
			req.user = user;
			cb(null, user);
		});
	};

	req.logout = function () {
		req.session.userId = null;
		req.user = null;
	};
	
	next();

});

app.use("/app", function (req, res, next) {
	var currentSession = req.session.userId;

	if (currentSession === null) {
		console.log("no session");
		res.redirect("/");
	}
	next();
});

// ROUTES
// ==========================================================
// ==========================================================
app.get("/", function (req, res) {
	var currentSession;
	if(req.session.userId) {
		currentSession = req.session.userId;
		console.log("has session");
		//res.redirect("/app");
	} else {
		res.sendFile(path.join(views, "home.html"));
	}
});


app.get("/app", function (req, res) {
	var appPath = path.join(views, "app.html");
	res.sendFile(appPath);

});

// USER ROUTES
//============

// Get User html layout 
app.get("/signup", function (req, res) {
	var signupPath = path.join(views, "signup.html");
	res.sendFile(signupPath);
});

// Create User
app.post("/users", function (req, res) {
	var user = req.body.user;
	console.log(user.name);
	db.User
		.createSecure(user.email, user.password, user.name.first, user.name.last,
		function (err, user) {
			//console.log(user);
			req.login(user);
			res.redirect("/app");
		});
});

// app.get("/users", function (req, res) {
//   db.User.find({},
//     function (err, users) {
//       res.send(users);
//     });
// });

// Get Login html layout
app.get("/login", function (req, res) {
	var loginPath = path.join(views, "login.html");
	res.sendFile(loginPath);
});

// Log In User 
app.post("/login", function (req, res) {
	var email = req.body.email;
	var password = req.body.password;
	console.log(email);
	console.log(password);

	db.User
		.authenticate(email, password,
		function (err, user) {
			req.login(user);
			console	.log(user);
			res.send(user);
		});
});

// Log Out User
app.post("/logout", function (req, res) {
	  req.logout();
	  res.send(201);
});

// Get User Profile
app.get("/profile", function (req, res) {
	req.currentUser(function (err, user){
		res.send(user);
	});
});

// CLIENT ROUTES
//==============

// Get Clients
app.get("/:id/clients", function (req, res) {
	var user = req.session.userId;

	db.Client.find({
		userId: user
	},
		function (err, clients) {
			res.send(clients);
		});
});

// Create Clients
app.post("/clients", function (req, res) {
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

// Get Jobs html layout
app.get("/jobs", function (req, res) {
	var jobsPath = path.join(views, "jobs.html");
	res.sendFile(jobsPath);
});

// Get Jobs
app.get("/:id/jobs", function (req, res) {
		db.Client.find({
		_id: req.params.id 
	},
		function (err, jobs) {
			res.send(201, jobs);
		});
});

// Create Job
app.post("/:id/jobs", function (req, res) {
	var clientId = req.params.id;
	var jobName = req.body.name;
	
	db.Client.update(
		{ _id: clientId},
		{ $push: { jobs: { name: jobName } } },
		function (err, success) {
			res.send(201);
		});
});

// Delete Job
app.delete("/:id/delete", function (req, res) {
	var jobId = req.params.id;
	var clientId = req.body.id;

	db.Client.deleteJob(jobId, clientId,
		function (err, job) {
			res.send(201);
	});
});

// Start Timing Job
app.put("/:id/start", function (req, res) {
	var jobId = req.params.id;
	var clientId = req.body.id;
	
	db.Client.startTime(jobId, clientId,
			function (err, job) {
				res.send(201);
		});
});

// Stop Timing Job
app.put("/:id/stop", function (req, res) {
	var jobId = req.params.id;
	var clientId = req.body.id;

	db.Client.stopTime(jobId, clientId,
		function (err, job) {
			res.send(201);
	});
});

// LISTEN
// ==========================================================
// ==========================================================

// LISTEN ON PORT
app.listen(process.env.PORT || 3000, function() {
	console.log("EXPRESS RUNNING...");
});
