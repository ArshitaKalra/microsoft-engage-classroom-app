const mongoose = require('mongoose');
var TeacherSchema=new mongoose.Schema({
    name:String,
    password:String,
    email:String,
    mobile:String,
    pic:String,
    institute:String,
    specialization:String,
    dob:String,
    address:String,
    courseoffered:[String]
});
module.exports=mongoose.model("teacher",TeacherSchema);