const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { i18next, i18nextHttpMiddleware } = require('./config/i18n'); // Correctly import both
const userRoutes = require('./routes/users');
const bookRoutes = require('./routes/books');
const libraryRoutes = require('./routes/libraries');
const borrowRoutes = require('./routes/borrow');
const inventoryRoutes = require('./routes/inventory');
const returnRoutes = require('./routes/return');


const app = express();
const PORT = process.env.PORT || 5000;




// Middleware
app.use(i18nextHttpMiddleware.handle(i18next)); 
app.use(bodyParser.json());
// Use the middleware

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/bookkeeping', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
app.use('/api/users', userRoutes);       // User management
app.use('/api/books', bookRoutes);       // Book management
app.use('/api/libraries', libraryRoutes); // Library management
app.use('/api/borrow', borrowRoutes);     // Borrowing management
app.use('/api/return', returnRoutes);      // Returning books (specific route)


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
