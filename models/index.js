var mongoose = require("mongoose");
mongoose.connect( process.env.MONGOLAB_URI ||
               process.env.MONGOHQ_URL || 
               "mongodb://localhost/timekard");

module.exports.User = require("./user");
module.exports.Client = require("./client");
