var mongoose = require("mongoose");
var fs = require("fs");

var db = mongoose.connect("mongodb+srv://arshita:arshita@cluster0.mvx4m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

var models_path = __dirname + "/../server/models";

fs.readdirSync(models_path).forEach(function(file) {
	if(file.indexOf(".js") > 0 ) {
		require(models_path + "/" + file);
	}
});
module.exports.db = db;