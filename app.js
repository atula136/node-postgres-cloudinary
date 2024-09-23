const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const bodyParser = require('body-parser');
const routes = require("./routes/routes");

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
  useTempFiles: true, //the file is written to disk instead of being stored in memory => imageFile.data is empty
  tempFileDir: '/tmp/'
}));

app.use('/', routes)

module.exports = app;