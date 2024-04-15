const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Ensure environment variables are loaded at the top
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Adjust the path as necessary

const app = express();

// Middleware setup
app.use(express.json()); // For parsing application/json

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// User Registration Route
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).send('User registered successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// User Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, 'YOUR_SECRET_KEY', { expiresIn: '24h' }); // Replace 'YOUR_SECRET_KEY' with your secret key
      res.json({ token });
    } else {
      res.status(401).send('Login failed.');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Server start
const PORT = process.env.PORT || 3000; // Declare PORT before using it
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
