var mongoose = require('mongoose');
var Topic = mongoose.model('Topics');

module.exports = (function() {
	return {

		// Create a new topic
		create: function(req, res) {
			var newTopic = new Topic(req.body);
			newTopic.save(function(err, info) {
				if(err)
					console.log("Error creating a new topic", err)
				else {
					Topic.find({}, function(err, data) {
						if(err)
							console.log("Error getting all topics", err);
						else
							var data = {data: data, info: info}
							res.json(data);
					})
				}
			})
		},

		// View all topics
		read: function(req, res) {
			Topic.find({}, function(err, data) {
				if(err)
					console.log("Error getting all topics" ,err)
				else
					res.json(data)
			})
		},

		// Find one topic by topic id
		getOne: function(req, res) {
			Topic.findOne({_id: req.params.id}, function(err, data) {
				console.log(req.params.id);
				if(err)
					console.log("Error getting single topic by id:", err)
				else
					res.json(data);
			})
		},


		update: function(req, res) {
			Topic.findByIdAndUpdate(
				req.params.id,
				{$set: {posts: req.body.posts}},
				{new : true},
				function(err, data){
					if(err)
						console.log("Error upating topic by d", err)
					else
						res.json(data);
				}
			)
		}
	}
})();
