const path = require('path');
const api = require('./api.js');
const bodyParser = require('body-parser')
const cors = require('cors')

// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);

express = require('express');
const app = express()
const session = require("express-session");

app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({extended: true}))

const { MongoClient } = require('mongodb');
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

client.connect()
.then(res => console.log("Connected to the database !"))
.catch(e => console.log("Connection to the database FAILED"))

app.use(session({
    secret: "technoweb rocks", // peut etre modifie : joue le role d'un mdp
    resave: true,
    saveUninitialized: false
}));

app.use('/api', api.default(client));

app.on('close', async () => {
    await client.close()
    console.log("Disconnected to the database. Bye")
})

exports.default = app;

