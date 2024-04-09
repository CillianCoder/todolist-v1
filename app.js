const express = require("express");
const bodyParser = require("body-parser");
const app = express();

var item = ['Buy Food', 'Cook Food', 'Eat Food'];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));




app.get("/", function (req, res) {
    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    var day = today.toLocaleDateString("en-Us", options);

    res.render("list", { kindOfDay: day, newListItems: item});

});

app.post("/", function(req, res){
    var items = req.body.addItem;
    item.push(items);
    res.redirect("/");
})

app.listen(5000, function () {
    console.log("Server started on port 5000 ");
});
