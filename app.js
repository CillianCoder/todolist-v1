const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
var _ = require('lodash');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB");

//default value add to database
const todolistSchema = mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", todolistSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add new item"
});

const item3 = new Item({
    name: "< -- Hit this to delete item"
});

const defaultItem = [item1, item2, item3];

//Collection for custom name

const customNameSchema = mongoose.Schema({
    name: String,
    items: [todolistSchema]
});

const List = mongoose.model("List", customNameSchema);

//home route
app.get("/", function (req, res) {
    Item.find({})
        .then(function (foundItem) {
            if (foundItem.length === 0) {
                Item.insertMany(defaultItem)
                    .then(function () {
                        console.log("Default item insert successfully!");
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                res.redirect("/");
            } else {
                res.render("list", { listTitle: "Today", newListItems: foundItem });
            };
        })
        .catch(function (err) {
            console.log(err);
        })

});

//base on user custom category name
app.get("/:customListName", function (req, res) {
    const customName = _.capitalize(req.params.customListName);

    List.findOne({ name: customName })
        .then(function (found) {
            res.render("list", { listTitle: found.name, newListItems: found.items });
        })
        .catch(function () {
            const customList = new List({
                name: customName,
                items: defaultItem
            });
            customList.save();
            res.redirect("/" + customName);
        })

});

//add new item to database
app.post("/", function (req, res) {

    const items = req.body.addItem;
    const newUserItemName = req.body.button;

    const newItem = new Item({
        name: items
    });
    if (newUserItemName === "Today") {
        newItem.save();
        res.redirect("/");
    } else {
        List.findOne({ name: newUserItemName })
            .then(function (foundList) {
                foundList.items.push(newItem);
                foundList.save();
                res.redirect("/" + newUserItemName);
            })
            .catch(function (err) {
                console.log(err);
            })
    }
});

// delete user checkbox items
app.post("/delete", function (req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findOneAndDelete({ _id: checkedItemId })
            .then(function () {
                console.log("Delete success");
            })
            .catch(function (err) {
                console.log(err);
            });
        res.redirect("/");
    } else {
        List.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: checkedItemId } } }
        )
            .then(function () {
                res.redirect("/" + listName);
            })
            .catch(function (err) {
                console.log(err);
            });

    }

});

// app.post("/work", function (res, req) {
//     let items = req.body.addItem;
//     workItems.push(items);
//     res.redirect("/");
// });

app.get("/about", function (req, res) {
    res.render("about");
})

app.listen(5000, function () {
    console.log("Server started on port 5000 ");
});
