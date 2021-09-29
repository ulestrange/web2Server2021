const Joi = require('joi')
const express = require('express')

const books = require('./routes/books');
const home = require('./routes/home');
const { query } = require('express');
const app = express()
const port = 3000

// configure the middleware for parsing HTML request body

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies

app.use(middleware1);

// the routes



app.use('/', home)


app.use('/books', books);



function middleware1(req, res, next) {

    console.log('middleware 1 called ');

    if (req.query.id == "1") {
        res.send('query string with 1: request aborted')
    }
    else {

        next();
    }
}
function middleware2(req, res, next) {
    console.log('middleware 2 caalled ');
    next();
}


app.listen(port, () => console.log(`Example app listening on port ${port}!`))