const Joi = require('joi')
const express = require('express')

const books = require('./routes/books');
const home = require('./routes/home')
const app = express()
const port = 3000

// configure the middleware for parsing HTML requeest body

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies

// the routes

app.use('/', home)
app.use('/books', books);






app.listen(port, () => console.log(`Example app listening on port ${port}!`))