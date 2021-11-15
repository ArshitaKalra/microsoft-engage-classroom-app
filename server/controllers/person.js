var mongoose = require('mongoose');
var User = mongoose.model('Person');

module.exports = (function() {
    return {

		// creates a new user
        create: function(req, res) {
            var newUser = new User(req.body);
            newUser.save(function(err, data) {
                if (err)
                    console.log("Error creating a new user", err)
                else
                    res.json(data)
            })
        },

		// finds all users
        read: function(req, res) {
            User.find({}, function(err, data) {
                if (err)
                    console.log("Error getting all users", err)
                else
                    res.json(data)
            })
        },

		// gets a single user by id
        readOne: function(req, res) {
            User.find({
                _id: req.params.id
            }, function(err, data) {
                if (err)
                    console.log("Error getting single user", err);
                else
                    res.json(data);
            })
        },


        updateTopics: function(req, res) {
            User.findByIdAndUpdate(
                req.params.id, {
                    $set: {
                        topics: req.body.topics
                    }
                }, {
                    new: true
                },
                function(err, data) {
                    if (err)
                        console.log("Error updating topic", err)
                    else
                        res.json(data);
                }
            )
        },

        updatePosts: function(req, res) {
            User.findByIdAndUpdate(
                req.params.id, {
                    $set: {
                        posts: req.body.posts
                    }
                }, {
                    new: true
                },
                function(err, data) {
                    if (err)
                        console.log("Error updating post", err);
                    else
                        res.json(data);
                })
        },

        updateComments: function(req, res) {
            User.findByIdAndUpdate(
                req.params.id, {
                    $set: {
                        comments: req.body.comments
                    }
                }, {
                    new: true
                },
                function(err, data) {
                    if (err)
                        console.log("Error updating comment", err);
                    else
                        res.json(data);
                })
        }
    }
})();
