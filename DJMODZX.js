```
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
const server = require('./qr');
const code = require('./pair');

require('events').EventEmitter.defaultMaxListeners = 500;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/qr', server);
app.use('/code', code);
app.use('/pair',async (req, res, next) => {
    res.sendFile(path.join(__dirname, '/pair.html'))
})
app.use('/',async (req, res, next) => {
    res.sendFile(path.join(__dirname, '/main.html'))
})

app.listen(PORT, () => {
    console.log(`Powered by DJMODZX Server running on http://localhost:${PORT}`)
})

module.exports = app;
```
