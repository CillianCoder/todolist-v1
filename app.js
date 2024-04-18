const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js")

const item = ['Buy Food', 'Cook Food', 'Eat Food'];
const workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));




app.get("/", function (req, res) {
    const day = date.getDate();
    res.render("list", { listTitle: day, newListItems: item});

});

app.post("/", function(req, res){

    const items = req.body.addItem;

    if(req.body.button === "Work"){
        workItems.push(items);
        res.redirect("/work");
    }else{
        item.push(items);
        res.redirect("/");
    }
    
});

app.get("/work", function(req, res){
    res.render("list", {listTitle: "Work", newListItems: workItems});
});

app.post("/work", function(res, req){
    let items = req.body.addItem;
    workItems.push(items);
    res.redirect("/");
})

app.get("/about", function(req, res){
    res.render("about");
})

app.listen(5000, function () {
    console.log("Server started on port 5000 ");
});
