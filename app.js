const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/myDB')

const itemsSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model('Item', itemsSchema)

app.get('/', (req, res)=>{
    var today = new Date;
    var options = {
        day: 'numeric',
        weekday: 'long',
        month: 'long',
        year: 'numeric', 
    };
    var dateComplete = today.toLocaleDateString('en-US', options);

    Item.find({}, (err, items) => {
        res.render('template', {day:dateComplete, task: items});
    })
    
    
})

app.post('/', async (req, res)=>{
    await Item.create({name: req.body.newTask});

    res.redirect('/');
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log('server running on port 3000');
})