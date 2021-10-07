
const mongoose = require('mongoose');
const express = require('express');

// use object destructuring

const { Book, validate } = require('../models/books');

const router = express.Router();












router.post('/', async (req, res) => {

  let result = validate(req.body)

  if (result.error) {
    res.status(400).json(result.error);
    return;
  }


  let book = new Book(req.body);

  book = await book.save();

  res.location(`/${book._id}`)
    .status(201)
    .json(book);

});

router.get('/', async (req, res) => {
  const books = await Book.find();
  res.json(books);
})


router.get('/:id', async (req, res) => {

  try {
    const book = await Book.findById(req.params.id);

    if (book) {
      res.json(book);
    }
    else{
      res.status(404);
      res.json({ error: 'not found' });
    }
   
  }
  catch {
    res.status(404);
    res.json({ error: 'not found' });
  }

})


router.delete('/:id', async (req, res) => {

 try{
  const book = await Book.findByIdAndDelete(req.params.id)
  res.send(book)
 }
 catch{
    res.status(404).json(`book with that ID ${req.params.id} was not found`);
 }

})

router.put('/:id', (req, res) => {

  const id = req.params.id;

  const result = validate(req.body)

  if (result.error) {
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