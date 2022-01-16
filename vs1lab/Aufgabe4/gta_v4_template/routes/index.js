// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
const store = new GeoTagStore();

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', { taglist: store.getObjectArray(store.getTags()) })
});

router.post('/tagging',  (req, res) => {

  let tag = new GeoTag(req.body['tag_latitude'], req.body['tag_longitude'], req.body['name'], req.body['hashtag']);

  store.addGeoTag(tag);


  store.ip.getTag().latitude = req.body['tag_latitude'];
  store.ip.getTag().longitude = req.body['tag_longitude'];

  res.render('index', {
    latitude: tag.getTag().latitude,
    longitude: tag.getTag().longitude,
    latitude2: tag.getTag().latitude,
    longitude2: tag.getTag().longitude,
    name: tag.getTag().name,
    hashtag: tag.getTag().hashtag,
    taglist: store.getObjectArray(store.getTags()),
    iplat: store.ip.getTag().latitude,
    iplong : store.ip.getTag().longitude,
  });
});


router.post('/discovery', (req, res) => {

  let searchItem = req.body['searchBox'];
  let result = store.searchNearbyGeoTags(searchItem.toString());
  if (searchItem !== '') {
    if (result.length > 0) {
      res.render('index', {
        latitude: result[0].latitude,
        longitude: result[0].longitude,
        latitude2: result[0].latitude,
        longitude2: result[0].longitude,
        name: result[0].name,
        hashtag: result[0].hashtag,
        taglist: result,
        iplat: store.ip.getTag().latitude,
        iplong: store.ip.getTag().longitude,
      });
    } else {
      res.render('index', {
        taglist: result,
        iplat: store.ip.getTag().latitude,
        iplong: store.ip.getTag().longitude,
      });
    }
  } else {
    result = store.getNearbyGeoTags(store.ip.getTag().latitude, store.ip.getTag().longitude, 5)

    if(result.length > 0 && req.body['data-latitude'] !== 'undefined') {
      res.render('index', {
        taglist: result,
        latitude: result[0].latitude,
        longitude: result[0].longitude,
        latitude2: result[0].latitude,
        longitude2: result[0].longitude,
        name: result[0].name,
        hashtag: result[0].hashtag,
        iplat: store.ip.getTag().latitude,
        iplong: store.ip.getTag().longitude,
      });
    }
    else {
      res.render('index', {
        taglist: [],
        iplat: store.ip.getTag().latitude,
        iplong: store.ip.getTag().longitude,
      });
    }
  }
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

// TODO: ... your code here ...

router.get('/api/geotags/', (req, res) => {

  let searchTerm = req.query.searchBox;
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;
  let radius = req.query.radius;

  console.log(req.query);

  if (searchTerm !== undefined) {
    res.json({
      taglist: store.searchNearbyGeoTags(searchTerm)
    });
  } else if (latitude !== undefined && longitude !== undefined) {
    if (radius !== undefined) {
      res.json({
        taglist: store.getNearbyGeoTags(parseFloat(latitude), parseFloat(longitude), parseFloat(radius)),

      });
    } else {
      res.json({
        taglist: store.getNearbyGeoTags(parseFloat(latitude), parseFloat(longitude)),

      });
    }
    } else {
    res.json({
      taglist: store.getObjectArray(store.getTags()),

    });
  }

});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.post('/api/geotags', (req,res) => {
      let tag = new GeoTag(parseFloat(req.body.latitude), parseFloat(req.body.longitude), req.body.name, req.body.hashtag);
      store.addGeoTag(tag);
      let id = (store.getTags().length !== 0)? store.getTags().length - 1 : 0;
      res.setHeader('Location', 'http://localhost:3000/api/geotags/' + id);
      res.status(201).end();
  });

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.get('/api/geotags/:id', (req, res) =>{
    let id = parseFloat(req.params.id);
    if(id >= 0 && id <= store.getTags().length - 1){
      let tag = store.getTags()[id].getTag();
      res.json({
        latitude: tag.latitude,
        longitude: tag.longitude,
        name: tag.name,
        hashtag: tag.hashtag
      })
    }

} );



/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

// TODO: ... your code here ...
router.put('/api/geotags/:id' , (req, res) =>{

  let id = parseFloat(req.params.id);
  store.getTags()[id] = new GeoTag(parseFloat(req.body.latitude), parseFloat(req.body.longitude), req.body.name, req.body.hashtag);
  store.getPrimaryKeys()[id] = {
    id: id,
    key: 'GT' + Math.floor(Math.pow(10, 7) + Math.random() * 9 * Math.pow(10, 7))
  };
  res.json({
    latitude: store.getTags()[id].getTag().latitude,
    longitude: store.getTags()[id].getTag().longitude,
    name: store.getTags()[id].getTag().name,
    hashtag: store.getTags()[id].getTag().hashtag
  })
})

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

// TODO: ... your code here ...
router.delete('/api/geotags/:id', (req,res) => {
  let id = parseFloat(req.params.id);
  let tag =  store.getTags()[id].getTag();
      store.removeGeoTag(id);
  res.json({
    latitude:tag.latitude,
    longitude: tag.longitude,
    name:tag.name,
    hashtag: tag.hashtag
  })
});


module.exports = router;
