const express = require('express')
const app = express()
const port = 3000

// configure the middleware for parsing HTML requeest body

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies

let books = [
  {
    "id": 1,
    "name": "Gansta Granny"
  },
  {
    "id": 2,
    "name": "The Boy in the Dress"
  },
  {
    "id": 3,
    "name": "Bad Dad"
  },
];

app.get('/', (req, res) => res.send('Hello World from Una using nodemon!'))

app.get('/bananas', (req, res) =>
  res.send('hello world, this is bananas'));


app.post('/books', (req, res) => {

  const newBookId = books.length;

  const book = {id: newBookId, ...req.body};

  books.push(book);

  res.location(`/books/${newBookId}`)
    .status(201)
    .json(book);


  console.log(`book name is ${book.name} number of book(s) is ${books.length}`);

});

app.get('/books', (req, res) => {
  res.json(books);
})


app.get('/books/:id', (req, res) => {

  const id = req.params.id;

  const book = books.find(b => b.id === parseInt(req.params.id))

  if (!book) {
    res.status(404);
    res.json({ error: 'not found' });
    return 
  }

  res.json(book);
})


app.delete('/books/:id', (req, res) => {

  const id = req.params.id;

  const book = books.find(b => b.id === parseInt(req.params.id))

  let id = req.params.id;
  console.log(`removing book ${books[id].name}`)
  books.splice(req.params.id, 1);
  res.send(books);

})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))