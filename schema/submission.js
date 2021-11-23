const mongoose = require('mongoose');
var SubmissionSchema=new mongoose.Schema({
    submittedBy:String,
    assignment:String,
    filename:{type:String,require:true},
    // grade:{type:Number,default:0,min:0,max:10},
    onTime:{type:Date,require:true}
},{timestamps:true});
module.exports=mongoose.model("submission",SubmissionSchema);