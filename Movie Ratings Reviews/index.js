const express = require('express');
const mongoose = require('mongoose');
const controller = require('./controllers');

const app = express();

mongoose.connect('mongodb+srv://avi:Secure@2021*@cluster0.k3rkf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',

  { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Database connection established');
});
const cors = require('cors')

var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}

app.use(cors(corsOptions))

app.use('/', controller);

app.listen('3604', () => {
  console.log('App is running on port 3604');
});
