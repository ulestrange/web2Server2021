
const Joi = require('joi');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    year_written: Number,
    edition: String,
    price: Number,
    nested: { author : { name : String, nationality : String}},
    tags: [String]
})

const Book = mongoose.model('Book', bookSchema);

function validateBook(book) {
    const schema = Joi.object({
        title: Joi.string().min(3),
        year_written: Joi.number().integer().min(1500),
        author: Joi.object().keys( {
            name: Joi.string(), 
            nationality: Joi.string()
        }),
        edition: Joi.string(),
        price: Joi.number(),
        tags: Joi.array().items(Joi.string())
    })
    return schema.validate(book);
}

exports.Book = Book;
exports.validate = validateBook;