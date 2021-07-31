const express = require('express');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('view engine', 'ejs')

var task = [];

app.get('/', (req, res)=>{
    var today = new Date;
    var options = {
        day: 'numeric',
        weekday: 'long',
        month: 'long',
        year: 'numeric', 
    };
    var dateComplete = today.toLocaleDateString('en-US', options);
    
    res.render('template', {day:dateComplete, task: task});
})

app.post('/', (req, res)=>{
    task.push(req.body.newTask);

    res.redirect('/');
})

app.listen(3000, ()=>{
    console.log('server running on port 3000');
})