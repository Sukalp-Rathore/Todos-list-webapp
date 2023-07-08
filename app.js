//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser : true});
const itemSchema =  {
  name : String 
};
const Item  = mongoose.model("Item",itemSchema);
const item1 = new Item({
  name:"welcome1"
});
const item2 = new Item({
  name:"welcome2"
});
const item3 = new Item({
  name:"welcome3"
});
const defaultItems = [item1,item2,item3]; 


const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

async function getItems(res){
  const foundItems = await Item.find({});
  if(foundItems.length===0){
    Item.insertMany(defaultItems);
    res.redirect('/')
  }
  return foundItems;
}

app.get("/", function(req, res) {
  getItems().then(function(foundItems){
  res.render("list",{listTitle:"Today",newListItems:foundItems});
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  })

  item.save();
  res.redirect('/');

});

app.get("/about", function(req, res){
  res.render("about");
});

app.post('/delete',function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId).exec();
  res.redirect('/');
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
