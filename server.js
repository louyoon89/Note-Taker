const express = require("express");
const path = require("path");
const fs = require("fs");
// Helper method for generating unique ids
const uuid = require("./helper/uuid");

const app = express();
const PORT = process.env.PORT || 3001;

let listData = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

//get requests for notes
app.get("/api/notes", function (err, res) {
  try {
    listData = fs.readFileSync("./db/db.json", "utf8");
    console.log("Success!");
    listData = JSON.parse(listData);
  } catch (err) {
    console.log("Error!");
    console.log(err);
  }
  res.json(listData);
});
