const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path as needed
const router = express.Router();

// Register a new user (both authors and borrowers)
router.post('/register', async (req, res) => {
    const { name, username, password, role } = req.body;

    if (!name || !username || !password || !role) {
        return res.status(400).json({ error: 'Please provide name, username, password, and role.' });
    }

    if (!['Author', 'Borrower'].includes(role)) {
        return res.status(400).json({ error: 'Role must be either Author or Borrower.' });
    }

    try {
        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username is already taken.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create a new user
        const newUser = new User({
            name,
            username,
            password: hashedPassword,
            role
        });

        // Save to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error registering user:', error); // Log the actual error
        res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide both username and password.' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
