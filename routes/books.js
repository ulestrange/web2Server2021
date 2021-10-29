
const mongoose = require('mongoose');
const express = require('express');
const validationMiddleware = require('../middleware/jwtvalidation');

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

  const { title, year, limit, pagenumber, pagesize } = req.query;

  let filter = {}

  if (title) {
    filter.title = { $regex: `${title}`, $options: 'i' };
  }

  // the year filter first needs to parse the year

  const yearNumber = parseInt(year)

  if (!isNaN(yearNumber)) {
    filter.year_written = yearNumber
  }

  let limitNumber = parseInt(limit);

  if (isNaN(limitNumber)) {
    limitNumber = 0
  }

  let pageSizeNumber = parseInt(pagesize);

  if (isNaN(pageSizeNumber)) {
    pageSizeNumber = 0
  }
  let pageNumberNumber = parseInt(pagenumber);

  if (isNaN(pageNumberNumber)) {
    pageNumberNumber = 1
  }

  console.table(filter);

  const books = await Book.
    find(filter).
    limit(pageSizeNumber).
    sort({price : 1, year_written : -1}).
    skip((pageNumberNumber -1)*pageSizeNumber)




  res.json(books);
})


router.get('/:id', validationMiddleware.validJWTNeeded, async (req, res) => {

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

    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
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