const express = require("express");
const data = require("./db/db.json");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");

const app = express();
const PORT = process.env.port || 4001

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

    //commented out because its redundant. app.use(express.static('public')); already covers this get request.
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname + "/public/index.html"))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname + "/public/notes.html"))
);

    // api routes
app.get('/api/notes', (req, res) =>
    res.json(data)
);

app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request recieved to add a note`);
    
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text
        };

        newNote.id = uuidv4();
        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);

        data.push(newNote);
        fs.writeFile(__dirname + "/db/db.json", JSON.stringify((data), null, 4), "utf8", () => {
            res.json(data);
        })
    } else {
        res.status(500).json('Error occurred, note was unable to post. Title and text are required.')
    }
});

app.delete("/api/notes/:id", (req, res) => {
    const selectedNote = req.params.id
    console.log(selectedNote);
    
    const index = data.findIndex((note) => note.id === parseInt(selectedNote));

    data.splice(index, 1);

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify((data), null, 4), "utf8", () => {
        res.json(data);
    })
});

app.listen(PORT, () =>
console.log(`App listening at ${PORT} 🚀`));