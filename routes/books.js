
const mongoose = require('mongoose');
const express = require('express');

// use object desctructing


const {Book, validate} = require('../models/books');

const router = express.Router();





async function createBook() {
  
  const book = new Book({
    name: 'Una',
    quantity: '5'
  });

  const result = await book.save();
  console.log(result);
}






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

router.get('/', async (req, res) => {
  const books = await Book.find();
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



module.exports = router;