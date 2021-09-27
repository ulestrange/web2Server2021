const Joi = require('joi')
const express = require('express')
const app = express()
const port = 3000

// configure the middleware for parsing HTML requeest body

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies

let books = [
  {
    "bookId": 1,
    "name": "Gansta Granny",
    "quantity": 3
  },
  {
    "bookId": 2,
    "name": "The Boy in the Dress",
    "quantity": 2
  },
  {
    "bookId": 3,
    "name": "Bad Dad"
  },
];

app.get('/', (req, res) => res.send('Hello World from Una using nodemon!'))

app.get('/bananas', (req, res) =>
  res.send('hello world, this is bananas'));


app.post('/books', (req, res) => {

  const newBookId = books.length;

  const book = { bookId: newBookId, ...req.body };

  const result = validateBook(req.body)

  if (result.error)
  {
    res.status(400).json(result.error);
    return;
  }


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

  const book = books.find(b => b.bookId === parseInt(req.params.id))

  if (!book) {
    res.status(404);
    res.json({ error: 'not found' });
    return
  }

  res.json(book);
})


app.delete('/books/:id', (req, res) => {

  const id = req.params.id;

  const book = books.find(b => b.bookId === parseInt(req.params.id))

  if (!book) {
    res.status(404).json(`book with that ID {id} was not found`);
    return;
  }


  const index = books.indexOf(book);

  books.splice(index, 1);
  res.send(book);

})

app.put('/books/:id', (req, res) => {

  const id = req.params.id;

  const result = validateBook(req.body)

  if (result.error)
  {
    res.status(400).json(result.error);
    return;
  }

  const book = books.find(b => b.bookId === parseInt(req.params.id))

  if (!book) {
    res.status(404).json(`book with that ID {req.params.id} was not found`);
    return;
  }

  console.log(`changing book ${book.name}`);
  book.name = req.body.name;
  book.quantity = req.body.quantity;

  res.send(book);

})

function validateBook(book) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    quantity: Joi.number().integer().min(0)
  })
  return schema.validate(book);
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))