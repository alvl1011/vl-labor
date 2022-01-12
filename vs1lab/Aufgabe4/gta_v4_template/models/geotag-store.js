// File origin: VS1LAB A3
const { HTTPVersionNotSupported } = require("http-errors");
const app = require("../app");
const { response } = require("../app");
const GeoTag = require("./geotag");
const GeoTagExamples = require("./geotag-examples");
const MapManager = require('../public/javascripts/map-manager');
const https = require('https');

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{


   // #tagList = GeoTagExamples.tagList;
    #tagList = [];
    ip = new GeoTag();

    constructor() {
       GeoTagExamples.tagList.forEach(el => {
           let tmp = new GeoTag(el[1], el[2], el[0], el[3]);
           this.#tagList.push(tmp);
       })
    }

    getTags() {
        return this.#tagList;
    }



    addGeoTag(tag) {
        if (tag !== null && tag !== undefined) {
            let isAdded = true;
            this.#tagList.forEach(res=> {
                if (res.getTag().name.toLowerCase() === tag.getTag().name.toLowerCase()) {
                    isAdded = false;
                } else if (res.getTag().longitude === tag.getTag().longitude && res.getTag().latitude === tag.getTag().latitude)
                    isAdded = false;
            });
            if (isAdded) {
                this.#tagList.push(tag);
                console.log(tag.getTag());
                return 1;
            }
        }
    }

    removeGeoTag(tag) {
       if (tag !== null && tag !== undefined) {
           this.#tagList.pop(tag);
           return 1;
       }
       return 1;
    }

    getNearbyGeoTags(latitude, longitude, radius = 2) {
        let results = [];
        this.#tagList.forEach( el => {
            let dist = this.#getDistanceFromLatLong(el.getTag().latitude, el.getTag().longitude, latitude, longitude);
            if (dist <= radius) {
                results.push(el);
            }
        });
        return results;
    }

   searchNearbyGeoTags(key) {
        let results = [];
        this.#tagList.forEach(element => {
           let compareName = element.getTag().name.toLowerCase().search(key.toLowerCase());
           let compareHashTags = element.getTag().hashtag.toLowerCase().search(key.toLowerCase());

           if (compareHashTags !== -1 || compareName !== -1)
               results.push(element);
           console.log(element.getTag().name);
           console.log(element.getTag().hashtag);
           console.log(typeof element.getTag().name);
        });
        return results;
    }

    #getDistanceFromLatLong(latitudeA, longitudeA, latitudeB, longitudeB) {
        let R = 6371;  //Earth radius
        let radianLat = (latitudeB - latitudeA) * (Math.PI/180);
        let radianLon = (longitudeB - longitudeA) * (Math.PI/180);
        let a = Math.sin(radianLat/2) * Math.sin(radianLat/2) +
            Math.cos(latitudeA * (Math.PI/180)) * Math.cos(latitudeB * (Math.PI/180)) *
            Math.sin(radianLon/2) * Math.sin(radianLon/2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))); // return distance in km
    }
}

module.exports = InMemoryGeoTagStore

