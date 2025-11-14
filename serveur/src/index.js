const app = require('./app.js')
const port = 8000;

app.default.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`
)});