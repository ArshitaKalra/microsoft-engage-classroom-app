var mongoose = require('mongoose');
var Post = mongoose.model('Posts');

module.exports = (function() {
    return {

		//creates a new post
        create: function(req, res) {
            var newPost = new Post(req.body);
            newPost.save(function(err, data) {
                if (err)
                    console.log("error creating a new post", err)
                else
                    res.json(data)
            })
        },

		// View information for a single post
        read: function(req, res) {
            Post.find({
                topic_id: req.params.id
            }, function(err, data) {
                if (err)
                    console.log("error getting single post", err)
                else
                    res.json(data)
            })
        },

		// Update A Post with comments
        update: function(req, res) {
            Post.findByIdAndUpdate(
                req.params.id, {
                    $set: {
                        comments: req.body.comments
                    }
                }, {
                    new: true
                },
                function(err, data) {
                    if (err)
                        console.log("error updating post", err)
                    else
                        Post.find({
                            topic_id: data.topic_id
                        }, function(err, data) {
                            if (err)
                                console.log("post", err)
                            else
                                res.json(data);
                        })
                }
            )
        }
    }
})();
