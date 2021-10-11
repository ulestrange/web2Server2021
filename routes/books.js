
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

  try {

    book = await book.save();
    res.location(`/${book._id}`)
      .status(201)
      .json(book);
  }
  catch {
    res.status(500).json(result.error);
  }


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
    else {
      res.status(404).json('Not found');
    }
  }
  catch {
    res.status(404).json('Not found: id is weird');
  }

})


router.delete('/:id', async (req, res) => {

  try {
    const book = await Book.findByIdAndDelete(req.params.id)
    res.send(book)
  }
  catch {
    res.status(404).json(`book with that ID ${req.params.id} was not found`);
  }

})

router.put('/:id', async (req, res) => {



  const result = validate(req.body)

  if (result.error) {
    res.status(400).json(result.error);
    return;
  }

  console.log(req.body);

  try {

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (book) {
      res.json(book);
    }
    else {
      res.status(404).json('Not found');
    }
  }
  catch {
    res.status(404).json('Not found: id is weird');
  }

})



module.exports = router;