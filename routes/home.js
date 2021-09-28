const express = require('express')

const router = express.Router();

router.get('/', (req, res) => res.send('Hello World from Una using nodemon!'))

router.get('/bananas', (req, res) =>
  res.send('hello world, this is bananas'));

module.exports = router;