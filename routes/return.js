const express = require('express');
const router = express.Router();
const Book = require('../models/book'); // Ensure the path to your Book model is correct
const authMiddleware = require('../middleware/auth'); // Middleware for authentication

// PUT /api/return/:id - Return a borrowed book by its ID
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const bookId = req.params.id;

        // Find the book and ensure it has a borrower
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        if (!book.borrower) {
            return res.status(400).json({ error: 'Book is not borrowed' });
        }

        // Clear the borrower field
        book.borrower = null; // Or any other logic you want to implement
        await book.save();

        res.json({ message: 'Book returned successfully', book });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
