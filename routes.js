// Import frameworks
const express = require('express');
const router = express.Router();

// Import data
const rawVideos = require('./src/json/videos');
const rawArticles = require('./src/json/articles');
const rawGeneralRoutes = require('./src/json/generalRoutes');

// Convert JSON into HTML for display
const videos = rawVideos.map(video => {
  video.params = toString(video.params);
  video.returns = toString(video.returns);
  return video;
});
const articles = rawArticles.map(article => {
  article.params = toString(article.params);
  article.returns = toString(article.returns);
  return article;
});
const generalRoutes = rawGeneralRoutes.map(route => {
  route.params = toString(route.params);
  route.returns = toString(route.returns);
  return route;
});

// Helper function
function toString(thing, depth) {
  let indent = '';
  if (depth) {
    let i = 0;
    for (i; i < depth; i++) indent += '&nbsp;&nbsp;';
  }

  if (typeof thing === 'object') {
    // If this is an array (which, in JS, is a type of object)
    if (thing.constructor === Array) {
      let string = '[<br />';
      let value;
      for (value in thing) {
        string += `${indent}&nbsp;&nbsp;${toString(thing[value], depth ? (depth + 1) : 1)},<br />`;
      }
      string += `${indent}]`;
      return string;
    }

    // If this is a normal object
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
  articles,
  generalRoutes,
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
  if (path.startsWith('/api/videos')) {
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
  } else if (path.startsWith('/api/articles')) {
    articles.forEach(article => {
      if (article.route === path) {
        route = article;
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
    generalRoutes.forEach(generalRoute => {
      if (generalRoute.route === path) {
        route = generalRoute;
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
  }
});

// Videos
router.get('/videos', (req, res) => res.render('videos', {
  title: 'Nalda API | Videos',
  videos,
}));

// Articles
router.get('/articles', (req, res) => res.render('articles', {
  title: 'Nalda API | Articles',
  articles,
}));

// Handle 404 error
router.get('*', (req, res) => res.render('not-found', {
  title: 'Nalda API | Not Found',
}));

// Export the router
module.exports = router;
