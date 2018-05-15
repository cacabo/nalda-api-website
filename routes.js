// Import frameworks
const express = require('express');
const router = express.Router();

// Import data
const rawVideos = require('./src/json/videos');
const rawArticles = require('./src/json/articles');
const rawGeneralRoutes = require('./src/json/generalRoutes');
const rawAdminRoutes = require('./src/json/adminRoutes');
const rawListings = require('./src/json/listings');
const rawReviews = require('./src/json/reviews');
const rawUsers = require('./src/json/users');

// Helper function to format JSON for HTML
const format = (rawData) => (
  rawData.map(data => {
    data.params = toString(data.params);
    data.returns = toString(data.returns);
    return data;
  })
);

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

// Convert JSON into HTML for display
const videos = format(rawVideos);
const articles = format(rawArticles);
const listings = format(rawListings);
const generalRoutes = format(rawGeneralRoutes);
const adminRoutes = format(rawAdminRoutes);
const reviews = format(rawReviews);
const users = format(rawUsers);

// Homepage
router.get('/', (req, res) => res.render('home', {
  title: 'Nalda API',
  videos,
  articles,
  listings,
  generalRoutes,
  adminRoutes,
  reviews,
  users,
}));

// Get a specific route
router.get('/routes/:type/*', (req, res) => {
  // Isolate the route path
  const type = req.params.type;
  const url = req.originalUrl;

  // Offset 'routes'
  const path = url.substring(8 + type.length);

  // Isolate a specific route
  let route = null;

  // Helper function to render a specific route or render not found
  // If such a route does not exist
  const findRoute = (model) => {
    model.forEach(entry => {
      if (entry.route === path && entry.type === type) {
        route = entry;
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
  };

  // Find which object the route is in
  if (path.startsWith('/api/videos')) {
    findRoute(videos);
  } else if (path.startsWith('/api/articles')) {
    findRoute(articles);
  } else if (path.startsWith('/api/listings')) {
    findRoute(listings);
  } else if (path.startsWith('/api/admin')) {
    findRoute(adminRoutes);
  } else if (path.startsWith('/api/reviews')) {
    findRoute(reviews);
  } else if (path.startsWith('/api/users')) {
    findRoute(users);
  } else {
    findRoute(generalRoutes);
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

// Listings
router.get('/listings', (req, res) => res.render('listings', {
  title: 'Nalda API | Listings',
  listings,
}));

// Reviews
router.get('/reviews ', (req, res) => res.render('reviews', {
  title: 'Nalda API | Reviews',
  listings,
}));

// Admins
router.get('/admin', (req, res) => res.render('adminRoutes', {
  title: 'Nalda API | Admin',
  adminRoutes,
}));

// Users
router.get('/users', (req, res) => res.render('users', {
  title: 'Nalda API | Users',
  users,
}));

// Handle 404 error
router.get('*', (req, res) => res.render('not-found', {
  title: 'Nalda API | Not Found',
}));

// Export the router
module.exports = router;
