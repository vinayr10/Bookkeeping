const express = require('express');
const router = express.Router();
const Book = require('../models/book'); // Adjust the path to your Book model
const authMiddleware = require('../middleware/auth'); // JWT middleware
const User = require('../models/user'); // User model

// POST /api/borrow - Borrow a book against a charge
router.post('/', authMiddleware, async (req, res) => {
    const { bookId, charge } = req.body;
    
    try {
        // Check if the book is available for borrowing
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        if (book.borrower) {
            return res.status(400).json({ error: 'Book is already borrowed' });
        }

        // Set the borrower and charge
        const userId = req.user.id; // Get the authenticated user's ID from the token
        book.borrower = userId; // Assign the borrower
        book.charge = charge; // Assign the charge (if necessary)
        await book.save();

        res.json({ message: 'Book borrowed successfully', book });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
