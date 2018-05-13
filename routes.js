// Import frameworks
const express = require('express');
const router = express.Router();

// Homepage
router.get('/', (req, res) => res.render('home', {
  title: 'Nalda API',
}));

// Handle 404 error
router.get('*', (req, res) => res.render('not-found', {
  title: 'Nalda API | Not Found',
}));

// Export the router
module.exports = router;
