const mongoose = require('mongoose');
var CourseSchema=new mongoose.Schema({
    name:String,
    code:String,
    pic:String,
    prerequisite:String,
    instructor:String,
    enrolledstud:[String],
    cap:Number,
    meetlink:String,
    schedule: [String],
    classes:Number,
    offlineSeats:Number
});
module.exports=mongoose.model("course",CourseSchema);