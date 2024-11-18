const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

// Users array
let users = [];

// Admin user
const adminUser = { id: 1, name: "admin", email: "admin@spsgroup.com.br", type: "admin", password: "1234" };
users.push(adminUser);

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token not provided');

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) return res.status(401).send('Invalid token');
      req.user = decoded; // Save user information in the request
      next();
  });
};

// Create a new user
router.post('/api/users', verifyToken, (req, res) => {
  const { email } = req.body;

  // Verify if the email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
      return res.status(400).json({ message: "The email already exists" });
  }

    const user = { id: users.length + 1, ...req.body };
    users.push(user);
    res.status(201).json(user);
});

// Get all the users
router.get('/api/users', verifyToken, (req, res) => {
    res.json(users);
});

// Get a user by ID
router.get('/api/users/:id', verifyToken, (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

// Update a user by ID
router.put('/api/users/:id', verifyToken, (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');

    // Update the user fields
    Object.assign(user, req.body);
    res.json(user);
});

// Delete a user by ID
router.delete('/api/users/:id', verifyToken, (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) return res.status(404).send('User not found');

    if (req.params.id === '1') {
        return res.status(400).json({ message: "Cannot delete the admin user" });
    }

    users.splice(userIndex, 1);
    res.status(204).send(); // No content
});

// User authentication
router.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === adminUser.email && password === adminUser.password) {
        const token = jwt.sign({ email: adminUser.email, type: adminUser.type }, SECRET_KEY, { expiresIn: '1h' });
        return res.status(200).json({ message: "Authentication successful", token });
    }
    return res.status(401).json({ message: "Invalid credentials" });
});

module.exports = router;
