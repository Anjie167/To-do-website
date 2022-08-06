const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");



const app = express();



app.set('view engine', "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = mongoose.Schema({
    time: Number,
    name: {
        type: String,
        required: [true, "The task name is required"]
    },
    category: String,
});

const Item = mongoose.model("Item", itemsSchema);

const daysSchema = mongoose.Schema({
    time: Number,
    day: {
        type: String,
        required: [true, "What day is it ?!"]
    },
    task: itemsSchema
});

const Day = mongoose.model("Day", daysSchema);

app.get("/", function(req, res){
    let day = date.getDate();
    let weekday = date.getDay();
    Day.find({day: weekday}, function(err, data){
        if(err){
            console.log(err);
        }else{
            let names = []
            console.log(data);
            data.forEach(element => {
                names.push(element.task)
            });
            res.render("list", {listTitle: day, newListItem: names});            
        }
    });
    

});

app.get("/:customList", function(req, res){
  Item.find({category: req.params.customList},  function(err, data){
        if(err){
            console.log(err);
        }else{
            console.log(req.params.topic);
            console.log(data);
            res.render("list", {listTitle: req.params.customList, newListItem: data});
        }
        
    });
    
});

app.post("/", function(req, res){
    const task = req.body.newItem;
    let weekday = date.getDay();

    const tasnewItemk = new Item({
        time: 1,
        name: task,
        category: "work"
    });

    const todoTask = new Day({
        time: 1,
        day: weekday,
        task: tasnewItemk
    });

    

    if(req.body.list === "Work"){
       todoTask.save(); 
       tasnewItemk.save();

       res.redirect("/work");
    }else{
        todoTask.save(); 
        tasnewItemk.save();

        res.redirect("/")
    }
    console.log(req.body);
});

app.post("/delete", function(req,res){
    const checkedItemId = req.body.checkbox;
    Item.findById(checkedItemId, function(err, data){


    if(!err){
        Day.deleteOne({time: data.time}, function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Task has been deleted");
            }
            res.redirect("/");
        });
    }
       
    });
});

app.listen(3000, function(){
    console.log("server started on port 3000");
});