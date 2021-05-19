// Import packages
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuidv1 = require('uuid/v1');

const fs = require("fs");

// Aplicatia
const app = express();

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());


// Link SPA static files 
app.use("/", express.static('spa'));


// Create
app.post("/parti", (req, res) => {
  const partiList = readJSONFile();
  const newParte = req.body;
  newParte.id = uuidv1();
  const newParteList = [...partiList, newParte];
  writeJSONFile(newParteList);
  res.json(newParte);
});

// Read One
app.get("/parti/:id", (req, res) => {
  const partiList = readJSONFile();
  const id = req.params.id;
  let idFound = false;
  let foundParte;

  partiList.forEach(parte => {
    if (id === parte.id) {
      idFound = true;
      foundParte = parte
    }
  });

  if (idFound) {
    res.json(foundParte);
  } else {
    res.status(404).send(`Parte ${id} was not found`);
  }
});

// Read All
app.get("/parti", (req, res) => {
  const partiList = readJSONFile();
  res.json(partiList);
});

// Update
app.put("/parti/:id", (req, res) => {
  const partiList = readJSONFile();
  const id = req.params.id;
  const newParte = req.body;
  newParte.id = id;
  idFound = false;

  const newPartiList = partiList.map((parte) => {
     if (parte.id === id) {
       idFound = true;
       return newParte
     }
    return parte
  })
  
  writeJSONFile(newPartiList);

  if (idFound) {
    res.json(newParte);
  } else {
    res.status(404).send(`Parte ${id} was not found`);
  }

});

// Delete
app.delete("/parti/:id", (req, res) => {
  const partiList = readJSONFile();
  const id = req.params.id;
  const newPartiList = partiList.filter((parte) => parte.id !== id)

  if (partiList.length !== newPartiList.length) {
    res.status(200).send(`Parte ${id} was removed`);
    writeJSONFile(newPartiList);
  } else {
    res.status(404).send(`Parte ${id} was not found`);
  }
});

// Functia de citire din fisierul db.json
function readJSONFile() {
  return JSON.parse(fs.readFileSync("db.json"))["parti"];
}

// Functia de scriere in fisierul db.json
function writeJSONFile(content) {
  fs.writeFileSync(
    "db.json",
    JSON.stringify({ parti: content }),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}

// Pornim server-ul
app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);