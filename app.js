const express = require('express');
const mongoose = require('mongoose');
//require('dotenv').config()

const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/myDB')

const itemsSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model('Item', itemsSchema)

const item1 = new Item({
    name: 'Cook food'
})
const item2 = new Item({
    name: 'Write essay'
})
const item3 = new Item({
    name: 'Watch podcast'
})

const itemArray = [item1, item2, item3]

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

const List = mongoose.model('List', listSchema)

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
        if(items.length == 0) {
            Item.insertMany(itemArray, err => {
                if(err)
                    console.log(err);
                
                else
                    console.log('successfully added initial items');
            })
            res.redirect('/')
        }
        else
            res.render('template', {day:dateComplete, task: items});
    })
    
    
})

app.post('/', async (req, res)=>{
    await Item.create({name: req.body.newTask});

    res.redirect('/');
})

app.post('/delete', (req, res) => {
    Item.deleteOne({_id: req.body.checkbox}, err => {
        if(err) {
            console.log(err);
        }
        else {
            console.log('successfully deleted');
        }
    })
    res.redirect('/')
})

app.get('/:listName', (req, res) => {
    const listName = req.params.listName
    
    List.findOne({name: listName}, (err, list) => {
        if(err) {
            console.log(err);
        }
        else {
            if(list) {
                // show the existing list
                console.log('exists');
                res.render('template', {day: list.name, task: list.items})
            }
            else {
                // create a new list
                console.log('doesnt exist');
                List.create({
                    name: listName,
                    items: itemArray
                })
                console.log('list created successfully');
            }
        } 
    })
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log('server running on port 3000');
})