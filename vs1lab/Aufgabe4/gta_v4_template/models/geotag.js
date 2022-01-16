// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** * 
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */

class GeoTag {

    #tag = {
        latitude: '',
        longitude: '',
        name: '',
        hashtag: ''
    };


    constructor(latitude, longitude, name, hash) {
        this.#tag.latitude = latitude;
        this.#tag.longitude = longitude;
        this.#tag.name = name;
        this.#tag.hashtag = hash;
    }


    getTag() {
        return this.#tag;
    }

    
}


module.exports = GeoTag;
