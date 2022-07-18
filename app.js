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

let today = new Date;
let options = {
    day: 'numeric',
    weekday: 'long',
    month: 'long',
    year: 'numeric', 
};
let dateComplete = today.toLocaleDateString('en-US', options);

app.get('/', (req, res)=>{
    

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
            res.render('template', {date: dateComplete, list: "Today", task: items});
    })
    
    
})

app.post('/', (req, res)=>{
    const listName = req.body.listName
    const itemName = req.body.itemName

    const item = new Item({
        name: itemName
    })
    
    if(listName === "Today") {
        item.save()
        res.redirect('/')
    }
    else {
        List.findOne({name: listName}, (err, list) => {
            list.items.push(item)
            list.save()
            res.redirect(`/${listName}`)
        })
    }
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

app.get('/:customListName', (req, res) => {
    const customListName = req.params.customListName

    List.findOne({name: customListName}, (err, foundList) => {
        if(!err) {
            if(!foundList) {
                // create new list
                console.log("doesn't exist");

                const list = new List({
                    name: customListName,
                    items: itemArray
                })
                list.save()
                res.redirect(`/${customListName}`)
            } else {
                // show existsing list 
                console.log("exists");
                res.render('template', {date: dateComplete, list: foundList.name, task: foundList.items});
            }
        }
    })
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log('server running on port 3000');
})