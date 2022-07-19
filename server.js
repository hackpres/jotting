const express = require("express");
const data = require("./Develop/db/db.json");
const api = require("./Develop/public/assets/js/index.js")
const uuid = require("uuid");
const fs = require("fs");

const app = express();
const PORT = process.env.port || 3001

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use('/api', api);

app.get('/notes', (req, res) =>
    res.json(data)
);

app.post('/notes', (req, res) => {
    console.info(`${req.method} request recieved to add a note`);
    
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuid(),
        };

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error occurred, note was unable to post.')
    }
});

app.listen(PORT, () =>
console.log(`App listening at ${PORT} 🚀`));