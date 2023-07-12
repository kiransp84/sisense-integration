const https = require("https");
const fs = require("fs");
const express = require('express');
const { register } = require("./services");

const app = express()

// parse application/json
app.use(require('body-parser').json());

// parse application/json
app.use(require('cookie-parser')());

// services register 
register(app);

const port = 4000;

https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app)
  .listen(port, () => {
    console.log(`server is runing at port ${port}`)
  });

// static file hosting 
app.use(express.static('public'));