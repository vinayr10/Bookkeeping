const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Get token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, 'your_jwt_secret');
         // Ensure 'your_jwt_secret' matches the one used during signing
        req.user = decoded; // Store the user info in the request
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Failed to authenticate token' });
    }
};

module.exports = auth;

