const connectToMongo = require('./db');
const express = require('express');
const dotenv = require("dotenv");
const app = express()
const cors = require('cors')
const authRoute = require('./routes/auth')
const notesRoute = require('./routes/notes')


dotenv.config();
connectToMongo();

app.use(express.json())
app.use(cors({ credentials: true, origin: true }))


//Available Routes
app.use('/api/auth', authRoute)
app.use('/api/notes', notesRoute)


app.listen(5000, () => {
    console.log(`iNotebook backend running`)
})