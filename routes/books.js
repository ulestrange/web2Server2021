const Joi = require('joi');
const express = require('express');

const router = express.Router();

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




router.post('/', (req, res) => {

  const newBookId = books.length;

  const book = { id: newBookId, ...req.body };

  const result = validateBook(req.body)

  if (result.error)
  {
    res.status(400).json(result.error);
    return;
  }


  books.push(book);

  res.location(`/${newBookId}`)
    .status(201)
    .json(book);


  console.log(`book name is ${book.name} number of book(s) is ${books.length}`);

});

router.get('/', (req, res) => {
  res.json(books);
})


router.get('/:id', (req, res) => {

  const id = req.params.id;

  const book = books.find(b => b.id === parseInt(req.params.id))

  if (!book) {
    res.status(404);
    res.json({ error: 'not found' });
    return
  }

  res.json(book);
})


router.delete('/:id', (req, res) => {

  const id = req.params.id;

  const book = books.find(b => b.id === parseInt(req.params.id))

  if (!book) {
    res.status(404).json(`book with that ID {id} was not found`);
    return;
  }


  const index = books.indexOf(book);

  books.splice(index, 1);
  res.send(book);

})

router.put('/:id', (req, res) => {

  const id = req.params.id;

  const result = validateBook(req.body)

  if (result.error)
  {
    res.status(400).json(result.error);
    return;
  }

  const book = books.find(b => b.id === parseInt(req.params.id))

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

module.exports = router;