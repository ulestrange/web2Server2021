const express = require('express')
const app = express()
const port = 3000

// configure the middleware for parsing HTML requeest body

app.use(express.json());
app.use(express.urlencoded({extended: false})); //Parse URL-encoded bodies

let books = [];

app.get('/', (req, res) => res.send('Hello World from Una using nodemon!'))

app.get('/bananas', (req, res) =>
  res.send('hello world, this is bananas'));


  app.post('/books', (req, res) => {

    const book = req.body;
    
    const bookNumber = books.length;

    books.push(book);

    res.location(`/books/${bookNumber}`)
    .status(201)
    .json('book');


    console.log(`book name is ${book.name} number of book(s) is ${books.length}`);

});

  app.get('/books', (req, res) => {
      res.json(books);
  })


app.get('/books/:id', (req,res) => {

    let id = req.params.id;

    if (id >= books.length) 
    {
      res.status(404);
      res.json({error: 'not found'})
    }

     res.json(books[id]);
 })


app.delete('/books/:id',(req, res) => {
    let id = req.params.id; 
    console.log(`removing book ${books[id].name}`)
    books.splice(req.params.id, 1);
    res.send(books);

  })



app.listen(port, () => console.log(`Example app listening on port ${port}!`))