const mongoose = require('mongoose');
var UserSchema=new mongoose.Schema({
    name:String,
    password:String,
    email:String,
    mobile:String,
    pic:String,
    institute:String,
    dob:String,
    address:String,
    course:[String]
});
module.exports=mongoose.model("user",UserSchema);