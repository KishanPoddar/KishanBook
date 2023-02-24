const connectToMongo = require('./db');
const express = require('express');
const dotenv = require("dotenv");
const app = express()
const cors = require('cors')
const authRoute = require('./routes/auth')
const notesRoute = require('./routes/notes')
const { join } = require('path');


dotenv.config();
connectToMongo();

app.use(express.json())
app.use(cors({ credentials: true, origin: true }))


//Available Routes
app.use('/api/auth', authRoute)
app.use('/api/notes', notesRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(join(__dirname, "client", "build")));
    app.get("*", (req, res) => {
        res.sendFile(join(__dirname, "client", "build", "index.html"));
    });
}


app.listen(5000, () => {
    console.log(`KishanBook backend running`)
})