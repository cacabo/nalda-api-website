// Import frameworks
const express = require('express');
const router = express.Router();

// Import data
const rawVideos = require('./src/json/videos');
const videos = rawVideos.map(video => {
  video.params = toString(video.params);
  return video;
});

// Helper function
function toString(thing, depth) {
  let indent = '';
  if (depth) {
    let i = 0;
    for (i; i < depth; i++) indent += '&nbsp;&nbsp;';
  }

  if (typeof thing === 'object') {
    let string = '{<br/>';
    let key;
    for (key in thing) {
      string += `${indent}&nbsp;&nbsp;${key}: ${toString(thing[key], depth ? (depth + 1) : 1)},<br/>`;
    }
    string += `${indent}}`;
    return string;
  }
  return thing;
}

// Homepage
router.get('/', (req, res) => res.render('home', {
  title: 'Nalda API',
  videos,
}));

// Get a specific route
router.get('/routes/*', (req, res) => {
  // Isolate the route path
  const url = req.originalUrl;

  // Offset 'routes'
  const path = url.substring(7);

  // Isolate a specific route
  let route = null;

  // Find which object the route is in
  if (path.startsWith('/videos')) {
    videos.forEach(video => {
      if (video.route === path) {
        route = video;
      }
    });
    if (route) {
      res.render('route', {
        title: `Nalda API | ${path}`,
        route,
      });
      return;
    }

    // If no matching route was found
    res.render('not-found', {
      title: 'Nalda API | Not Found',
    });
  } else {
    res.render('not-found', {
      title: 'Nalda API | Not Found',
    });
  }
});

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
