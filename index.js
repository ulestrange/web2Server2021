


const Joi = require('joi');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const https = require('https')
const fs = require('fs');


const books = require('./routes/books');
const users = require('./routes/users');
const auth = require('./routes/auth');
const home = require('./routes/home');



const app = express();
const port = 3000;



const connectionString = 'mongodb://127.0.0.1:27017/books2021'


mongoose.connect(connectionString, {
  "useNewUrlParser": true,
  "useUnifiedTopology": true
}).
catch ( error => {
  console.log('Database connection refused' + error);
  process.exit(2);
})

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', () => {
  console.log("DB connected")
});

const corsOptions = {
  origin: 'https://localhost:4200',
  credentials: true // for cookies
}

// configure the middleware for parsing HTML requeest body

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies
app.use(cors(corsOptions));
app.use(cookieParser());



app.use('/books', books);
app.use('/users', users);
app.use('/auth', auth);
app.use('/', home);


const serverOptions = {
  key: fs.readFileSync("ssl/unalocal.key"),
  cert: fs.readFileSync("ssl/unalocal.cert")
};


https.createServer(serverOptions,app).listen(8080,() =>
  console.log(`listening on 8080, don't forget the https`));

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))