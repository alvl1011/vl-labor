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

let addTag = document.getElementById('tag-form');
addTag.addEventListener('submit', (event) => {
    event.preventDefault();
    let tag = {
        latitude: document.getElementById('tag_latitude').value,
        longitude: document.getElementById('tag_longitude').value,
        name: document.getElementById('name').value,
        hashtag: document.getElementById('hash').value
    };
    console.log(JSON.stringify(tag))
    let sendTagRequest = fetch('http://localhost:3000/api/geotags', {
        method: 'POST',
        headers: { 'Content-type': 'application/json'},
        body: JSON.stringify(tag)
    });
    sendTagRequest.then(data => console.log(data.body));
    getAllTags().then(r => r);
});

let discoveryTag = document.getElementById('discovery-form');
discoveryTag.addEventListener('submit', (event) => {
    event.preventDefault();
   let searchTerm =(document.getElementById('search').value[0] === '#') ? document.getElementById('search').value.split('#')[1] : document.getElementById('search').value;

   let latToSend = document.getElementById('data-latitude2').value;
   let lonToSend = document.getElementById('data-longitude2').value;
   let url = (searchTerm !== undefined ? 'http://localhost:3000/api/geotags?searchBox=': 'http://localhost:3000/api/geotags') + searchTerm;
   let searchRequest = fetch(url, {
       method: 'GET'
   });
    searchRequest.then(res => res.json()).then(data => {
        let tags = data.taglist;
        let htmlString = '';

        tags.forEach(tag => {
            htmlString +=
                "<li> " + tag.name + "  (" + tag.latitude + ", " + tag.longitude + ") " + tag.hashtag + " </li>";
        });
        document.getElementById('search').value = '';
        document.getElementById('discovery__results').innerHTML = '';
        document.getElementById('discovery__results').innerHTML += htmlString;
        document.getElementById('mapView').dataset.tags = JSON.stringify(data.taglist);
        updateLocation();
    });
});


function updateLocation() {
    if (document.getElementById('data-latitude').value === ''
        || document.getElementById('data-longitude').value === ''
        || document.getElementById('data-latitude2').value === ''
        || document.getElementById('data-longitude2').value === '')
    {
        LocationHelper.findLocation((helper) => {
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

async function setTags(response) {
    let serverResponse = response.json();
    serverResponse.then(res => {
        let tags = res.taglist;
        let htmlString = '';

        tags.forEach(tag => {
            htmlString +=
                "<li> " + tag.name + "  (" + tag.latitude + ", " + tag.longitude + ") " + tag.hashtag + " </li>";
        });
        document.getElementById('discovery__results').innerHTML = '';
        document.getElementById('discovery__results').innerHTML += htmlString;
        updateLocation();
    });
}

async function getAllTags() {
    let response = await fetch('http://localhost:3000/api/geotags');
    return await setTags(response);
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation();
    getAllTags().then(r => r);
});

