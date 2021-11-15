var mongoose = require('mongoose');
var Comment = mongoose.model('Comments');

module.exports = (function() {
    return {

        //creates a new comment
        create: function(req, res) {
            var newComment = new Comment(req.body);
            newComment.save(function(err, data) {
                if (err) {
                    console.log("Error creating a new comment", err)
                } else {
                    Comment.find({
                        post_id: data.post_id
                    }, function(err, data) {
                        if (err) {
                            console.log("Error finding all comments", err)
                        } else {
                            res.json(data);
                        }
                    })
                }
            })
        },

    }
})();
