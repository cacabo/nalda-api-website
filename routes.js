// Import frameworks
const express = require('express');
const router = express.Router();

// Import data
const videos = require('./src/json/videos');

// Homepage
router.get('/', (req, res) => res.render('home', {
  title: 'Nalda API',
  videos,
}));

// Videos
router.get('/videos', (req, res) => res.render('videos', {
  title: 'Nalda API | Videos',
  videos,
}));

// Handle 404 error
router.get('*', (req, res) => res.render('not-found', {
  title: 'Nalda API | Not Found',
}));

// Export the router
module.exports = router;
