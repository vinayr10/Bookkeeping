const express = require('express');
const router = express.Router();
const Library = require('../models/library'); // Adjust the path to your model
const authMiddleware = require('../middleware/auth'); // Middleware for authentication
const Book = require('../models/book'); // Adjust the path to your Book model

// GET /api/libraries/:id/inventory
router.get('/libraries/:id/inventory', authMiddleware, async (req, res) => {
    try {
        const libraryId = req.params.id;
        const library = await Library.findById(libraryId).populate('books'); // Populate to get book details

        if (!library) {
            return res.status(404).json({ error: 'Library not found' });
        }

        res.json(library.books); // Return the list of books in the library's inventory
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /api/libraries/:id/inventory
router.post('/libraries/:id/inventory', authMiddleware, async (req, res) => {
    const { bookId } = req.body; // Assume you're sending the book ID to add

    try {
        const libraryId = req.params.id;

        const library = await Library.findById(libraryId);
        if (!library) {
            return res.status(404).json({ error: 'Library not found' });
        }

        // Add the book ID to the library's books array
        library.books.push(bookId);
        await library.save();

        res.json({ message: 'Book added to library inventory', library });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /api/libraries/:id/inventory/:bookId
router.delete('/libraries/:id/inventory/:bookId', authMiddleware, async (req, res) => {
    try {
        const libraryId = req.params.id;
        const bookId = req.params.bookId;

        const library = await Library.findById(libraryId);
        if (!library) {
            return res.status(404).json({ error: 'Library not found' });
        }

        // Remove the book from the library's books array
        library.books = library.books.filter(id => id.toString() !== bookId);
        await library.save();

        res.json({ message: 'Book removed from library inventory', library });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
