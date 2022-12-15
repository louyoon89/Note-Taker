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

//post to add note
app.post("/api/notes", function (req, res) {
  try {
    listData = fs.readFileSync("./db/db.json", "utf8");
    console.log(listData);
    //converted to JSON
    listData = JSON.parse(listData);
    req.body.id = listData.length;
    //add note
    listData.push(req.body);
    listData = JSON.stringify(listData);
    //write updated note
    fs.writeFile("./db/db.json", listData, "utf8", function (err) {
      if (err) throw err;
    });
    console.log("Note Added!")
    res.json(JSON.parse(listData));
  } catch (err) {
    throw err;
    console.error(err);
  }
});

//delete existing note
//ref. (const handleNoteDelete, index.js)
//id = helper uuid
app.delete("/api/notes/:id", function (req, res) {
  try {
    listData = fs.readFileSync("./db/db.json", "utf8");
    listData = JSON.parse(listData);
    //filter out id
    listData = listData.filter(function (note) {
      return note.id != req.params.id;
    });
    listData = JSON.stringify(listData);
    //write new listdata updated after deleting/filtering
    fs.writeFile("./db/db.json", listData, "utf8", function (err) {
      if (err) throw err;
    });
    console.log("Note Delete!")
    res.send(JSON.parse(listData));
  } catch (err) {
    throw err;
    console.log(err);
  }
});

//"Get /notes" returns notes.html
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});
//"Get *" returns index.html
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
//"Get /api/notes" reads db.json/returns all saved 
app.get("/api/notes", function (req, res) {
  return res.sendFile(path.json(__dirname, "./db/db.json"));
});

app.listen(PORT, function () {
  console.log("The server is listening on " + PORT);
});
