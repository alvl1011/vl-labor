// File origin: VS1LAB A3

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
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag.js');
/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store.js');
const {log} = require("debug");
const store = new GeoTagStore();

const examples = require('../models/geotag-examples');

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  res.render('index', { taglist: store.getTags()
   })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...
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
        taglist: store.getTags(),
        iplat: store.ip.getTag().latitude,
        iplong : store.ip.getTag().longitude,
    });
});


/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

// TODO: ... your code here ...
router.post('/discovery', (req, res) => {

    let searchItem = req.body['searchBox'];
    let result = store.searchNearbyGeoTags(searchItem.toString());
    if (searchItem !== '') {
        if (result.length > 0) {
            res.render('index', {
                latitude: result[0].getTag().latitude,
                longitude: result[0].getTag().longitude,
                latitude2: result[0].getTag().latitude,
                longitude2: result[0].getTag().longitude,
                name: result[0].getTag().name,
                hashtag: result[0].getTag().hashtag,
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
        result = store.getNearbyGeoTags(store.ip.getTag().latitude, store.ip.getTag().longitude, 5);

        if(result.length > 0 && req.body['data-latitude'] !== 'undefined') {
            res.render('index', {
                taglist: result,
                latitude: result[0].latitude,
                longitude: result[0].longitude,
                latitude2: result[0].getTag().latitude,
                longitude2: result[0].getTag().longitude,
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

module.exports = router;
