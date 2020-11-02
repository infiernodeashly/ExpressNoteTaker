const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3002;
const mainDir = path.join(__dirname, "/public");

// serves the html files in our 'public' directory.
app.use(express.static('public'));
// parses the url body for key value pairs. The value can be anything since it is extended: true. 
app.use(express.urlencoded({ extended: true }));
// recognizes the incoming request as a JSON object and binds middleware to application.
app.use(express.json());


// posts new notes to notes list.
app.post("/api/notes", function (req, res) {
  // call already saved notes from the database.
  let noteSave = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  // define addNote for user input.
  let addNote = req.body;
  // creates unique ID
  let uId = (noteSave.length).toString();
  // creates addNote ID to equal the unique ID
  addNote.id = uId;
  // push the addNote to the noteSave list.
  noteSave.push(addNote);

  // write the new noteSave list into the database json object 'db.json'. (asynchronious with res.json(noteSave))
  fs.writeFileSync("./db/db.json", JSON.stringify(noteSave));
  // console newest note.
  console.log("Note saved to db.json. Content: ", addNote);
  // sends json response as the data in the noteSave list.
  res.json(noteSave);
})




// gets notes from the notes.html file
app.get("/notes", function (req, res) {
  res.sendFile(path.join(mainDir, "notes.html"));
});

// connects the notes to the json object containing the notes data and updates. 
app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

// pulls notes by ID. 
app.get("/api/notes/:id", function (req, res) {
  // reads already stored data as noteSave
  let noteSave = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(noteSave[Number(req.params.id)]);
});

// sends to the main splash page
app.get("*", function (req, res) {
  res.sendFile(path.join(mainDir, "index.html"));
});



// deletes notes by id. 
app.delete("/api/notes/:id", function (req, res) {
  // reads already stored data as noteSave
  let noteSave = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  // assigns noteID as primary key.
  let noteID = req.params.id;
  // sets nId to 0.
  let nId = 0;
  console.log(`Deleting note with ID ${noteID}`);
  // filters through notes
  noteSave = noteSave.filter(currentNote => {
    // returns the current note by ID as long as it does not equal the id of the note that was removed.
    return currentNote.id != noteID;
  })
  // realigns array to remove deleted file and update id/array index numbers. 
  for (currentNote of noteSave) {
    currentNote.id = nId.toString();
    // continues id count from where it was left off after delete of note and adjusting array ids. 
    nId++;
  }

  // write the new noteSave list into the database json object 'db.json'. (asynchronious with res.json(noteSave))
  fs.writeFileSync("./db/db.json", JSON.stringify(noteSave));
  res.json(noteSave);
})

// listens to port to make active.
app.listen(PORT, function () {
  console.log(`Now listening to port http://localhost:${PORT}. Enjoy your stay!`);
})