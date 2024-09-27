const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    library: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true },
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: false },
    image: { type: String },
    charge: { type: Number }
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
