// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console. 
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");
/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
function example(i) {
    console.log(i);
}
function updateLocation() {
    if (document.getElementById('data-latitude').value === ''
        || document.getElementById('data-longitude').value === ''
        || document.getElementById('data-latitude2').value === ''
        || document.getElementById('data-longitude2').value === '')
    {
        LocationHelper.findLocation((helper) => {
            console.log('findlocation')
            let mapManager = new MapManager('OKyaajOxtmZyIVOOjBDyWPFqLIXnwqpZ');
            document.getElementById('tag_latitude').value = helper.latitude;
            document.getElementById('tag_longitude').value = helper.longitude;
            document.getElementById('data-latitude').value = helper.latitude;
            document.getElementById('data-longitude').value = helper.longitude;
            document.getElementById('data-latitude2').value = helper.latitude;
            document.getElementById('data-longitude2').value = helper.longitude;
            document.getElementById('mapView').src = mapManager.getMapUrl(helper.latitude, helper.longitude);
        });
    } else {
        let tags = JSON.parse(document.getElementById('mapView').dataset.tags);
        let mapManager = new MapManager('OKyaajOxtmZyIVOOjBDyWPFqLIXnwqpZ');
        document.getElementById('mapView').src = mapManager.getMapUrl(tags[tags.length - 1].latitude, tags[tags.length - 1].longitude, tags, 12);
    }

}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
});
