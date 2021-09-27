//const mongodb = require('mongodb');


const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');

const books = require('./routes/books');
const home = require('./routes/home');

const app = express();
const port = 3000;

// connect to the database

// mongoose.connect('mongodb://localhost/books2021')
// .then(() => console.log('Connected to Mongodb...'))
// .catch(err => console.log('Could not connect to database...', err));


// configure the middleware for parsing HTML requeest body

const connectionString = 'mongodb://127.0.0.1:27017/books2021'

mongoose.connect(connectionString, {
  "useNewUrlParser": true,
  "useUnifiedTopology": true
}).
  then(console.log('connected to db ...')).
    catch(error => {
      console.log('Database connection refused' + error);
      process.exit(2);
    })

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies

app.use('/books', books);
app.use('/', home);






app.listen(port, () => console.log(`Example app listening on port ${port}!`))