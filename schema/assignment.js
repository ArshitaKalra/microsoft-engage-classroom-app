const mongoose = require('mongoose');
var AssignmentSchema=new mongoose.Schema({
    createdBy:String,
    name:String,
    course:String,
    filename:String,
    description:String,
    deadline:Date
});
module.exports=mongoose.model("assignment",AssignmentSchema);