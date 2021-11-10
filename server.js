const express = require('express'); 
const app = express();              
const port = 8000;                  

var { db } = require("./mongo")
app.get('/', (req, res) => {        
    res.sendFile('Public/index.html', {root: __dirname});      
});
app.get('/dashboard-stud', (req, res) => {        
    res.sendFile('Public/dashboard-stud.html', {root: __dirname});      
});
app.get('/courses-enrolled', (req, res) => {        
    res.sendFile('Public/courses-enrolled.html', {root: __dirname});      
});
app.get('/discussion-forum', (req, res) => {        
    res.sendFile('Public/discussion-forum.html', {root: __dirname});      
});
app.get('/phonebook', (req, res) => {        
    res.sendFile('Public/phonebook.html', {root: __dirname});      
});
app.get('/report', (req, res) => {        
    res.sendFile('Public/report.html', {root: __dirname});      
});
app.get('/allcourses', (req, res) => {        
    res.sendFile('Public/allcourses.html', {root: __dirname});      
});
app.get('/calendar', (req, res) => {        
    res.sendFile('Public/calendar.html', {root: __dirname});      
});

app.listen(port, () => {            
    console.log(`Now listening on port ${port}`); 
});