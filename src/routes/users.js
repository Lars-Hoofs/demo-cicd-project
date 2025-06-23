const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();

// Mock database
let users = [
  { id: 1, name: 'Jan Jansen', email: 'jan@example.com', created: new Date('2024-01-01') },
  { id: 2, name: 'Piet Pietersen', email: 'piet@example.com', created: new Date('2024-01-02') },
];

// Validation middleware
const validateUser = (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      error: 'Name and email are required',
    });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({
      error: 'Invalid email format',
    });
  }
  
  next();
};

// GET /api/users - Haal alle gebruikers op
router.get('/', (req, res) => {
  logger.info('Fetching all users');
  res.json({
    users,
    total: users.length,
  });
});

// GET /api/users/:id - Haal specifieke gebruiker op
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      error: 'User not found',
    });
  }
  
  logger.info(`Fetching user with id: ${id}`);
  res.json(user);
});

// POST /api/users - Maak nieuwe gebruiker aan
router.post('/', validateUser, (req, res) => {
  const { name, email } = req.body;
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({
      error: 'Email already exists',
    });
  }
  
  const newUser = {
    id: Math.max(...users.map(u => u.id), 0) + 1,
    name,
    email,
    created: new Date(),
  };
  
  users.push(newUser);
  logger.info(`Created new user: ${newUser.name}`);
  
  res.status(201).json(newUser);
});

// PUT /api/users/:id - Update gebruiker
router.put('/:id', validateUser, (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, email } = req.body;
  
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found',
    });
  }
  
  // Check if email already exists (excluding current user)
  const existingUser = users.find(u => u.email === email && u.id !== id);
  if (existingUser) {
    return res.status(409).json({
      error: 'Email already exists',
    });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    name,
    email,
    updated: new Date(),
  };
  
  logger.info(`Updated user with id: ${id}`);
  res.json(users[userIndex]);
});

// DELETE /api/users/:id - Verwijder gebruiker
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: 'User not found',
    });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  logger.info(`Deleted user with id: ${id}`);
  
  res.json({
    message: 'User deleted successfully',
    user: deletedUser,
  });
});

module.exports = router;
