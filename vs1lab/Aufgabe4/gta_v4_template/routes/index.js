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
const {log} = require("debug");
const store = new GeoTagStore();

const examples = require('../models/geotag-examples');


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

/**
 * A4.3:
 * Pagination
 */

var current_page = 1;
var records_per_page = 4;
 
router.post('/next', () => {
    if (current_page < numPages()) {
      current_page++;
      changePage(current_page);
    }
});

router.post('/previous', () => {
  if (current_page > 1) {
    current_page--;
    changePage(current_page);
  }
});

function changePage(page)
{
    var btn_next = document.getElementById("next");
    var btn_prev = document.getElementById("previous");
    var listing_table = document.getElementsByClassName("discovery__results");
    var page_span = document.getElementById("pagenumber");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    listing_table.innerHTML = "";

    for (var i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
        listing_table.innerHTML += store.taglist[i].name + "<br>";
    }
    page_span.innerHTML = page;

    if (page == 1) {
        btn_prev.disabled = "true";
    } else {
        btn_prev.disabled = "false";
    }

    if (page == numPages()) {
        btn_next.disabled = "true";
    } else {
        btn_next.disabled = "false";
    }
}

function numPages()
{
    return Math.ceil(store.length / records_per_page);
}

function pageinit() {
    changePage(1);
};

module.exports = router;
