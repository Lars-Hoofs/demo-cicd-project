const express = require('express');
const logger = require('../utils/logger');

const router = express.Router();

// POST /api/calculator/add - Optellen
router.post('/add', (req, res) => {
  const { a, b } = req.body;
  
  // Validatie
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({
      error: 'Both a and b must be numbers',
      received: { a: typeof a, b: typeof b }
    });
  }
  
  const result = a + b;
  logger.info(`Calculator: ${a} + ${b} = ${result}`);
  
  res.json({
    operation: 'addition',
    operands: { a, b },
    result,
    timestamp: new Date().toISOString()
  });
});

// POST /api/calculator/subtract - Aftrekken
router.post('/subtract', (req, res) => {
  const { a, b } = req.body;
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({
      error: 'Both a and b must be numbers'
    });
  }
  
  const result = a - b;
  logger.info(`Calculator: ${a} - ${b} = ${result}`);
  
  res.json({
    operation: 'subtraction',
    operands: { a, b },
    result,
    timestamp: new Date().toISOString()
  });
});

// POST /api/calculator/multiply - Vermenigvuldigen
router.post('/multiply', (req, res) => {
  const { a, b } = req.body;
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({
      error: 'Both a and b must be numbers'
    });
  }
  
  const result = a * b;
  logger.info(`Calculator: ${a} * ${b} = ${result}`);
  
  res.json({
    operation: 'multiplication',
    operands: { a, b },
    result,
    timestamp: new Date().toISOString()
  });
});

// POST /api/calculator/divide - Delen
router.post('/divide', (req, res) => {
  const { a, b } = req.body;
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({
      error: 'Both a and b must be numbers'
    });
  }
  
  if (b === 0) {
    return res.status(400).json({
      error: 'Division by zero is not allowed'
    });
  }
  
  const result = a / b;
  logger.info(`Calculator: ${a} / ${b} = ${result}`);
  
  res.json({
    operation: 'division',
    operands: { a, b },
    result,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
