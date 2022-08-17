const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
const _ = require('lodash');
//Making connections to port 27017(localhost)
mongoose.connect('mongodb+srv://drumil:test123@cluster0.ienck7l.mongodb.net/List', { useNewUrlParser: true });

//Making schema for the blog
const itemsSchema = new mongoose.Schema({
    // date: String,
    listContents: {
        type: String,
        require: [true, 'Plese add something before saving']
    }
});
const Item = mongoose.model('item', itemsSchema);
const listSchema = {
    name: String,
    items: [itemsSchema]
}
const List = new mongoose.model('list', listSchema);

const item1 = new Item({
    listContents: 'This is item1'
});
const item2 = new Item({
    listContents: 'This is item2'
});
const item3 = new Item({
    listContents: 'This is item3'
});
const defaultItems = [item1, item2, item3];

app.use(bodyParser.urlencoded({ extended: true }));


let workItems = [];

app.set('view engine', 'ejs');

app.use(express.static("public"));


app.get("/", function (req, res) {

    let day = date.getDate();
    Item.find(function (err, item) {
        if (err) {
            console.log(err);
        } else {
            if (item.length === 0) {
                Item.insertMany(defaultItems, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('The items are added succesfully');
                    }
                });
                res.redirect("/");
            } else {

                res.render("list", { listTitle: "Today", newListItems: item });
            }
        }
    });

});


app.post("/", function (req, res) {

    let newItem = req.body.newItem;
    const listName = req.body.list;
    const newArrayElement = new Item({
        listContents: newItem
    });
    if(listName === "Today"){

        newArrayElement.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName},function(err,foundList){
            foundList.items.push(newArrayElement);
            foundList.save();
            res.redirect("/"+ listName);
        })
    }
});


// app.get("/work", function (req, res) {

//     res.render("list", { listTitle: "Work List", newListItems: workItems });

// });
app.post("/delete", function (req, res, next) {

    const itemToDelete = req.body.checkBox;
    const listName = req.body.listName;

    if(listName === "Today"){
        //Checking if its the default list and if so we will delete selected items from there.
        Item.deleteOne({ _id: itemToDelete }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Succesfully Deleted the item");
                res.redirect("/");
            }
        });
    }else {
        //If its not the default list we should delete it from the appropriate list.
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: itemToDelete}}},function(err, foundList){
            if(!err){
                res.redirect(`/${listName}`);
            }
        });
    }
    console.log(itemToDelete);
    
});
app.get('/:costumListName', (req, res) => {
    const costumListName = _.capitalize(req.params.costumListName);
    console.log(costumListName);
    List.findOne({ name: costumListName}, function (err, foundList) {
       if(!err){
        if(!foundList){
            console.log('List dosent exist');
            console.log('making new List');
            const list = new List({
                name: costumListName,
                items: defaultItems
            });
            list.save();
            res.redirect("/" + costumListName);
        }else{
            //show Exsisting list
            console.log('List exist');
            res.render("list",{ listTitle: foundList.name, newListItems: foundList.items });
        }
       }else{
        console.log(err);
       }
    });
     
    
});
Item.find(function (err, item) {
    if (err) {
        console.log(err);
    } else {
        item.forEach(function (item) {

            console.log(item.listContents);
        });
    }
});
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
  }
app.listen(port, function () {

    console.log("We are live !!!");

});