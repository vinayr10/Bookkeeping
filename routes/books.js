const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const authMiddleware = require('../middleware/auth');
const Library = require('../models/library');

// GET /api/books
router.get('/', authMiddleware, async (req, res) => {
    const books = await Book.find().populate('author library borrower');
    res.json(books);
});

// GET /api/books/:id
router.get('/:id', authMiddleware, async (req, res) => {
    const book = await Book.findById(req.params.id).populate('author library borrower');
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
});

// POST /api/books
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, author, library, image, borrower, charge } = req.body;

        // Basic validation
        if (!title || !author || !library || !image) {
            return res.status(400).json({ error: 'Please provide title, author, library, and image fields.' });
        }

        // Create a new Book instance
        const newBook = new Book({
            title,
            author,
            library,
            image,
            charge,
            borrower: borrower || null // borrower is optional; set to null if not provided
        });

        // Save the new book to the database
        await newBook.save();

        // Find the library and update its books array
        const libraryToUpdate = await Library.findById(library);
        if (libraryToUpdate) {
            libraryToUpdate.books.push(newBook._id); // Add the new book's ID to the library's books array
            await libraryToUpdate.save(); // Save the updated library
        } else {
            return res.status(404).json({ error: 'Library not found' });
        }

        res.status(201).json({ message: req.t('success'), book: newBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /api/books/:id
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const bookId = req.params.id;
        const updates = req.body;

        // Validate that at least one field is being updated
        if (!Object.keys(updates).length) {
            return res.status(400).json({ error: 'No fields provided for update.' });
        }

        // Update the book document
        const updatedBook = await Book.findByIdAndUpdate(bookId, updates, { new: true, runValidators: true })
            .populate('author', 'name username role')  // Populate author details
            .populate('library', 'name address')       // Populate library details
            .populate('borrower', 'name username role'); // Populate borrower details

        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json({ message: 'Book updated successfully', book: updatedBook });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/books/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
});

module.exports = router;
