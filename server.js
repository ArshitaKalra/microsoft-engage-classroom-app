const express = require('express'); 
var path = require("path")
const app = express();              
const port = 8000;                  
var session = require("express-session");
var multer = require("multer");
var bodyparser = require("body-parser");


var { db } = require("./mongo")
var usersCol = require("./schema/users")

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

app.use(express.static("public"))
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');         ///////////////////////////////////////////////////////////////////
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


app.use((req, res, next) => {
    const {
        userid
    } = req.session
    if (userid) {
        async function set(req, res) {
            await usersCol.findOne({
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
        userid
    } = req.session;
    var bool = "false";
    if (userid) bool = "true";
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

app.get('/profile', redirectLogin, (req, res) => {
    res.render("profile", {
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
                    res.redirect('/home')


                });



            })
    } else
        res.render("register", {
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
app.get('/dashboard-stud', (req, res) => {        
    res.sendFile('public/dashboard-stud.html', {root: __dirname});      
});
app.get('/courses-enrolled', (req, res) => {        
    res.sendFile('public/courses-enrolled.html', {root: __dirname});      
});
app.get('/discussion-forum', (req, res) => {        
    res.sendFile('public/discussion-forum.html', {root: __dirname});      
});
app.get('/phonebook', (req, res) => {        
    res.sendFile('public/phonebook.html', {root: __dirname});      
});
app.get('/report', (req, res) => {        
    res.sendFile('public/report.html', {root: __dirname});      
});
app.get('/allcourses', (req, res) => {        
    res.sendFile('public/allcourses.html', {root: __dirname});      
});
app.get('/calendar', (req, res) => {        
    res.sendFile('public/calendar.html', {root: __dirname});      
});

app.listen(port, () => {            
    console.log(`Now listening on port ${port}`); 
});