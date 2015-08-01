var mongoose = require("mongoose");

var clientSchema = new mongoose.Schema({
										userId: {
											type: String,
											required: true	
										},
										name: {
											type: String,
											required: true
										},
										jobs: [
											{
												name: {
													type: String
												},
												clockOn: {
													type: Boolean,
													default: false
												},
												start: {
													type: Date,
												},
												totals: [{
													type: Number
												}],
												totalTime: {
													type: String,
													default: "00:00:00"
												},
											}
										]
});

clientSchema.statics.stopTime = function (jobId, clientId, cb) {
	// get start + convert to time
	// subtract startTime form current time

	var timeDiff;
	var that = this;

	var stopTime = function (jobId, clientId, callback){
		that.findOne(
			{ _id: clientId, "jobs._id": jobId },
			{ "jobs.$.start": 1 },
		function(err, result){
			var start = result.jobs[0].start.getTime();
			var now = new Date().getTime();
			timeDiff = (now - start);

			// push total into totals array
				that.update(
				{ _id: clientId, "jobs._id": jobId }, 
				{ $push: { "jobs.$.totals": timeDiff }, $set: { "jobs.$.clockOn": false } },
				callback);
		});	
	};
		
	stopTime(jobId, clientId, function(success) {
		// add total time here 
		getTotalTime(jobId, clientId, that, function(success){
					cb();
		});
	});
};

clientSchema.statics.deleteClient = function (clientId, cb) {
	this.findOneAndRemove(
	{ _id: clientId }, cb);
};

clientSchema.statics.deleteJob = function (jobId, clientId, cb) {
	this.update(
		{ _id: clientId}, 
		{ $pull: { "jobs": { "_id": jobId } } },
		cb);
};

var getTotalTime = function (jobId, clientId, user, callback) {
	// find totals
	user.findOne(
		{ _id: clientId, "jobs._id": jobId },
	 	{ "jobs.$.totals": 1 },
	 	function (err, result) {
			var jobTotals = (result.jobs[0].totals);
			
			// sum totals
			var sum = 0;
			for (var i = 0; i < jobTotals.length; i++) {
				if ( !isNaN(parseFloat(jobTotals[i]) ) && isFinite(jobTotals[i]) ) {
					sum += jobTotals[i];
				}
			}

			// convert sum to human time
			var humanTime = sum.toHHMMSS();

			// update totalTime
			user.update(
				{ _id: clientId, "jobs._id": jobId },
				{ "jobs.$.totalTime": humanTime }, 
			callback);
		}
	);
};

// Start timer
clientSchema.statics.startTime = function (jobId, clientId, cb) {
	var date = new Date();

	this.update(
		{ _id: clientId, "jobs._id": jobId },
		{ $set: {"jobs.$.start": date, "jobs.$.clockOn": true } },
	cb);	
};

// Convert timestamp (milliseconds) to human time
Number.prototype.toHHMMSS = function () {
    var secNum = Math.floor(parseInt(this, 10) / 1000);
    var hours   = Math.floor(secNum / 3600);
    var minutes = Math.floor((secNum - (hours * 3600)) / 60);
    var seconds = secNum - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0" + hours;}
    if (minutes < 10) {minutes = "0" + minutes;}
    if (seconds < 10) {seconds = "0" + seconds;}
    var time    = hours + ':' + minutes + ':' + seconds;
    return time;
};

// Export model
var Client = mongoose.model("Client", clientSchema);

module.exports = Client;
