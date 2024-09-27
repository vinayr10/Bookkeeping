const express = require('express');
const router = express.Router();
const Library = require('../models/library');
const authMiddleware = require('../middleware/auth');

// GET /api/libraries
router.get('/', authMiddleware, async (req, res) => {
    const libraries = await Library.find().populate('books');
    res.json(libraries);
});

// GET /api/libraries/:id
router.get('/:id', authMiddleware, async (req, res) => {
    const library = await Library.findById(req.params.id).populate('books');
    if (!library) return res.status(404).json({ message: 'Library not found' });
    res.json(library);
});

// POST /api/libraries
router.post('/', authMiddleware, async (req, res) => {
    const { name, address } = req.body;
    const newLibrary = new Library({ name, address });
    await newLibrary.save();
    res.json({ message: 'Library created successfully' });
});

// PUT /api/libraries/:id
router.put('/:id', authMiddleware, async (req, res) => {
    const updatedLibrary = await Library.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedLibrary);
});

// DELETE /api/libraries/:id
router.delete('/:id', authMiddleware, async (req, res) => {
    await Library.findByIdAndDelete(req.params.id);
    res.json({ message: 'Library deleted successfully' });
});

router.get('/:id/inventory', authMiddleware, async (req, res) => {
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
router.post('/:id/inventory', authMiddleware, async (req, res) => {
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
router.delete('/:id/inventory/:bookId', authMiddleware, async (req, res) => {
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
