const mongoose = require('mongoose');

var db = mongoose.connect("mongodb+srv://arshita:arshita@cluster0.mvx4m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useUnifiedTopology: true, useNewUrlParser: true }).then(() => {
        console.log("Connected");
    }).catch((err) => {
        console.log(err);
    });
module.exports.db = db;