const express = require('express'); 
var path = require("path")
const app = express();              
const port = 8000;                  
var session = require("express-session");
var multer = require("multer");
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

var bodyparser = require("body-parser");
const fileUpload = require('express-fileupload');
const fs = require('fs');


var { db } = require("./config/mongoose")
var usersCol = require("./schema/users")
var teacherCol= require("./schema/teacher")
var courseCol= require("./schema/courses")
// var assignmentCol = require("./schema/assignment")
// var submissionCol = require("./schema/submission")
var Binary = require("./config/mongoose").Binary;

app.set('views', [__dirname + '/views', __dirname + '/client/views']);
app.set('view engine', 'ejs'); //'html'
// app.engine('html', require('ejs').renderFile);

const SESS_name = "sid";
app.use(session({
    name: SESS_name,
    resave: false,
    saveUninitialized: false,
    secret: "shhshh",
    cookie: {}
}));

app.use(express.static(__dirname+'/public'))
app.use(express.static(path.join(__dirname, '/client')));
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');         
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
var upload = multer({
    storage: storage
});

const redirectLogin = (req, res, next) => {
    if (!req.session.userid) {
        res.redirect('/login')
    } else {
        next();
    }
}

const redirectHome = (req, res, next) => {
    if (req.session.userid) {
        res.redirect('/home')
    } else {
        next();
    }
}

app.use(bodyparser.urlencoded({
    "extended": true
}));

app.use(bodyparser.json());

app.use((req, res, next) => {
    const {
        userid,
        occupation
    } = req.session
    if (userid) {
        async function set(req, res) {
            var commonCol=usersCol;
            if(occupation==1)
                commonCol=teacherCol;
            await commonCol
            .findOne({
                    email: userid
                })
                .then(function (result) {

                    if (result) {
                        res.locals.user = result;

                    }


                })
                .catch(function (msg) {
                    res.send({
                        err: msg
                    });
                });
            next();
        }
        set(req, res);




    } else
        next();

})

app.get('/', (req, res) => {
    const {
        userid,
        occupation
    } = req.session;
    var bool = 0;
    if(userid){
    if (occupation==0) bool = 1;
    else if(occupation)bool = 2;
    }
    res.render("index", {
        bool: bool
    })

})
app.get('/home', redirectLogin, (req, res) => {
    const {
        user
    } = res.locals;
    res.render("home", {
        user: res.locals.user
    });

})



app.get('/login', redirectHome, (req, res) => {
  
    res.render("login", {
        error: ""
    })
})

app.get('/register', redirectHome, (req, res) => {
    res.render("register", {
        error: ""
    })
})
app.get('/homet', redirectLogin, (req, res) => {
    const {
        user
    } = res.locals;
    res.render("homet", {
        user: res.locals.user
    });

})
app.get('/logint', redirectHome, (req, res) => {
  
    res.render("logint", {
        error: ""
    })
})

app.get('/registert', redirectHome, (req, res) => {
    res.render("registert", {
        error: ""
    })
})



app.get('/profile', redirectLogin, (req, res) => {
    res.render("profile", {
        user: res.locals.user
    });
})
app.get('/profilet', redirectLogin, (req, res) => {
    res.render("profilet", {
        user: res.locals.user
    });
})

app.post("/profile", redirectLogin, upload.single('pic'), (req, res) => {
    if (req.file) {
        req.body.pic = req.file.filename;
    } else {
        req.body.pic = req.body.hdn;
    }
    usersCol.findOneAndUpdate({
        email: req.body.email
    }, {
        $set: {
            mobile: req.body.mobile,
            pic: req.body.pic,
            occupation: req.body.institution,
            address: req.body.address,
            dob: req.body.dob
        }
    }, {
        new: true
    }).then((docs) => {
        if (docs) {

            res.redirect("profile");
        } else {
            res.send("Error Occured");
        }
    })

})
app.post("/profilet", redirectLogin, upload.single('pic'), (req, res) => {
    if (req.file) {
        req.body.pic = req.file.filename;
    } else {
        req.body.pic = req.body.hdn;
    }
    usersCol.findOneAndUpdate({
        email: req.body.email
    }, {
        $set: {
            mobile: req.body.mobile,
            pic: req.body.pic,
            occupation: req.body.institution,
            address: req.body.address,
            dob: req.body.dob
        }
    }, {
        new: true
    }).then((docs) => {
        if (docs) {

            res.redirect("profile");
        } else {
            res.send("Error Occured");
        }
    })

})

app.post('/login', redirectHome, (req, res) => {
    const {
        email,
        password
    } = req.body;
    if (email && password) {
        usersCol.findOne({
                email: email
            })
            .then(function (result) {

                if (result) {
                    req.session.userid = email;
                    req.session.occupation=0;
                    req.session.name=result.name;
                    res.redirect('/home')
                } else
                    return res.redirect('/login');

            })
            .catch(function (msg) {
                console.log(msg)
            });

    } else
        res.render('login', {
            error: "Please Fill Details Properly"
        });

})
app.post('/register', redirectHome, (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;
    if (name && email && password) {
        usersCol.findOne({
                email: email
            })
            .then((data) => {
                if (data) {
                    console.log("user exist")
                    return res.render("register", {
                        error: "USER ALREADY EXISTS"
                    });
                }
                req.body.pic = "user.png";
                var collection = new usersCol(req.body);

             
               
                collection.save(function (err, doc) {
                    if (err)
                        console.log(err)
                  
                    req.session.userid = email;
                    req.session.occupation=0;
                    res.redirect('/home')


                });



            })
    } else
        res.render("register", {
            error: "Please Fill Details Properly"
        })

})


app.post('/logint', redirectHome, (req, res) => {
    const {
        email,
        password
    } = req.body;
    if (email && password) {
        teacherCol.findOne({
                email: email
            })
            .then(function (result) {

                if (result) {
                    req.session.userid = email;
                    req.session.occupation=1;
                    res.redirect('/homet')
                } else
                    return res.redirect('/logint');

            })
            .catch(function (msg) {
                console.log(msg)
            });

    } else
        res.render('logint', {
            error: "Please Fill Details Properly"
        });

})
app.post('/registert', redirectHome, (req, res) => {
    const {
        name,
        email,
        password
    } = req.body;
    if (name && email && password) {
        teacherCol.findOne({
                email: email
            })
            .then((data) => {
                if (data) {
                    console.log("user exist")
                    return res.render("registert", {
                        error: "USER ALREADY EXISTS"
                    });
                }
                req.body.pic = "user.png";
                var collection = new teacherCol(req.body);

             
               
                collection.save(function (err, doc) {
                    if (err)
                        console.log(err)
                  
                    req.session.userid = email;
                    req.session.occupation=1;
                    res.redirect('/homet')


                });



            })
    } else
        res.render("registert", {
            error: "Please Fill Details Properly"
        })

})
app.post('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home')
        }
        res.clearCookie(SESS_name);
        res.redirect('/');
    })

})

/*
app.get('/', (req, res) => {        
    res.sendFile('index1', {root: __dirname});      
});*/
app.get('/create-course', (req, res) => {        
    res.render("create-course", {
        user: res.locals.user
    });      

});

app.post('/create-course', (req, res) => {        
   console.log(JSON.stringify(req.body));
   const {
    code
} = req.body;
if (code) {
    courseCol.findOne({
            code: code
        })
        .then((data) => {
            if (data) {
                console.log("course exist")
                return res.render("create-course", {
                    error: "USER ALREADY EXISTS"
                });
            }
            req.body.pic = "course.png";
            var schedule=[];
            if(req.body.monday){
                schedule[0]=req.body.tmonday
            }
            else{
                schedule[0]="";
            }
            if(req.body.tuesday){
                schedule[1]=req.body.ttuesday
            }
            else{
                schedule[1]="";
            }
            if(req.body.wednesday){
                schedule[2]=req.body.twednesday
            }
            else{
                schedule[2]="";
            }
            if(req.body.thursday){
                schedule[3]=req.body.tthursday
            }
            else{
                schedule[3]="";
            }
            if(req.body.friday){
                schedule[4]=req.body.tfriday
            }
            else{
                schedule[4]="";
            }
            if(req.body.saturday){
                schedule[5]=req.body.tsaturday
            }
            else{
                schedule[5]="";
            }
            if(req.body.sunday){
                schedule[6]=req.body.tsunday
            }
            else{
                schedule[6]="";
            }
            console.log(schedule);
            req.body.schedule=schedule;
            var collection = new courseCol(req.body);

         
           
            collection.save(function (err, doc) {
                if (err)
                    console.log(err)
              
            


            });



        })
        teacherCol.findOneAndUpdate({
            email: req.session.userid
        }, {
            $push: {
                courseoffered: req.body.code,
               
            }
        }, {
            new: true
        }).then((docs) => {
            if (docs) {
    
               // res.redirect("profile");
            } else {
                res.send("Error Occured");
            }
        })


        
} else
    res.render("registert", {
        error: "Please Fill Details Properly"
    })
   

});

app.get('/phonebook', (req, res) => {        
    usersCol.find({}, function (err, studDetails){
        if (err) {
            console.log(err);
        } else {
            teacherCol.find({}, function(err, teacherDetails){
                if(err){
                    console.log(err)
                }else{
                    res.render("phonebook", {
                        details: studDetails,
                        tdetails:teacherDetails
                    });
                }
            })
        }
    });
});
app.get('/allcourses', (req, res) => {        
    courseCol.find({}, function (err, courses){
        if (err) {
            console.log(err);
        } else {
            res.render("allcourses", {
                courses: courses,
            });
           
        }
    });
});


app.get('/enroll',(req,res)=>{
    // console.log(req.session.userid)
    const code=req.query.code;
    var start,classes,schedule,name;
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    courseCol.findOneAndUpdate({
        code: code
    }, {
        $push: {
            enrolledstud: req.session.userid,
            offlineStud : {
                email:req.session.userid,
                name:req.session.name
            }
           
        }
    }, {
        new: true
    }).then((docs) => {
        if (docs) {
            res.send("Enrolled");
            classes=docs.classes;
            schedule=docs.schedule;
            name=docs.name;
            studentsSchedule=[];
            var date=new Date();
    const title=name;
    const url='/singlecoursepage?code='+code;
    while(classes!=0){

        date=date.addDays(1);
        var day=date.getDay();
        day=(day+6)%7;
        if(schedule[day]!=''){
            date.setHours(schedule[day][0]+schedule[day][1],schedule[day][3]+schedule[day][4],0)
            studentsSchedule.push({
                title:title,
                url:url,
                start:date
            })
            classes-=1;
        }

    }
    usersCol.findOneAndUpdate({
        email: req.session.userid
    }, {
        $push: {
            course: code,
            schedule:studentsSchedule
           
        }

    }, {
        new: true
    }).then((docs) => {
        if (docs) {

           // res.redirect("profile");
        } else {
            res.send("Error Occured");
        }
    })

        } else {
            res.send("Error Occured");
        }
    })
})

app.get('/remove',(req,res)=>{
    
    courseCol.findOneAndUpdate({
        code:req.query.code
    },
    {$pull:{
        offlineStud:{email:req.query.email}
    }
    }
    ).then((docs)=>{
        res.send("Deleted");
    })
})

app.get('/unbookSeat',(req,res)=>{
    
    courseCol.findOneAndUpdate({
        code:req.query.code
    },
    {$pull:{
        offlineStud:{email:req.session.userid}
    }
    }
    ).then((docs)=>{
        res.send("Deleted");
    })
})
app.get('/course-offered', (req, res) => {        
    var coursesOffered=res.locals.user.courseoffered;
    var courseOfferedDetails=[];
    courseCol.find({}, function (err, courses){
        if (err) {
            console.log(err);
        } else {
            coursesOffered.forEach((item)=>{
                courseOfferedDetails.push(courses.find(coursedetail => coursedetail.code==item))
  
            })

            res.render("course-offered",{
                courses:courseOfferedDetails
            })
            
        }
    });   
});

app.get('/updateseat', (req,res)=> {
    var seats = req.query.offlineSeats;
    var code = req.query.course;
    courseCol.findOneAndUpdate({
        code: code
    }, {
        $set:{
            offlineSeats: seats
         }

    },
    {
        new: true,
        upsert:true
    }).then((docs) => {
        if (docs) {
            // res.send("Updated");
        } else {
            res.send("Error Occured");
        }
    })

});

app.post('/addAssign', upload.single("uploadFile"), (req,res)=> {
    var code = req.body.forCourse;
    var title = req.body.assignTitle;
    var description = req.body.description;
    var deadline = req.body.deadline;
    const url='/tsinglecoursepage?code='+code;
    var filename = req.file.filename;
    courseCol.findOneAndUpdate({
        code: code
    },{
        $push:{
            assignment:{
            title:title,
            description:description,
            deadline:deadline,
            file:filename
            }
        }
    }).then((docs) => {
        if (docs) {
            res.redirect(url);
        } else {
            res.send("Error Occured");
        }
    })
});

app.post('/submitAssign', upload.single("submission"), (req,res)=>{
    console.log(req.body)
    var filename = req.file.filename;
    const url='/singlecoursepage?code='+req.body.scourse;
    courseCol.findOneAndUpdate({
        code: req.body.scourse,
        "assignment.title": req.body.assignCode
    },{
        $push:{
            "assignment.$.submission":{
                name:req.session.name,
                filename:filename
            }
        }
    }).then((docs) => {
        if (docs) {
            res.redirect(url);
        } else {
            res.send("Error Occured");
        }
    })
})

app.get('/course-enrolled', (req, res) => {   
    var coursesEnrolled=res.locals.user.course;
    var courseEnrolledDetails=[];
    courseCol.find({}, function (err, courses){
        if (err) {
            console.log(err);
        } else {
            coursesEnrolled.forEach((item)=>{
                courseEnrolledDetails.push(courses.find(coursedetail => coursedetail.code==item))
  
            })

            res.render("course-enrolled",{
                courses:courseEnrolledDetails
            })
            
        }
    });
   
});

app.get('/singlecoursepage',(req,res)=>{

    const code=req.query.code;
    courseCol.find({code: code}, function (err, course){
        if (err) {
            console.log(err);
        } else {
        
           
            res.render("singlecoursepage",{
                course:course[0]
            })
            
        }
    });
})
app.get('/bookseat',(req,res)=>{
    courseCol.findOneAndUpdate({
        code: req.query.code
    }, {
        $push: {
            course:  req.session.userid,
            // offlineStud: req.session.userid,

        },
        $inc:{
            bookedSeats: 1
            // offlineSeats: -1
         }

    },
   
    
    {
        new: true
    }).then((docs) => {
        if (docs) {
            res.send("Seat Booked");
           // res.redirect("profile");
        } else {
            res.send("Error Occured");
        }
    })
})
app.get('/tsinglecoursepage',(req,res)=>{

    const code=req.query.code;
    courseCol.find({code: code}, function (err, course){
        if (err) {
            console.log(err);
        } else {
        
           
            res.render("tsinglecoursepage",{
                course:course[0]
            })
            
        }
    });
})

var server = app.listen(port, () => {            
    console.log(`Now listening on port ${port}`); 
});

const socket = require('socket.io');
const io = socket(server);

io.on("connection", function(socket){
    console.log("made socket connection");
    socket.on('disconnect', function() {
        console.log("Disconnected - Socket ID: ", socket.id);
    })
    socket.on('created_topic', function(data) {
        socket.broadcast.emit('topic_added', data);
    })
});
require("./config/routes.js")(app);
