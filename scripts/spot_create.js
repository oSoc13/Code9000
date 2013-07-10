/**
SPOT.JS
Because we want to spot things.
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
Nico Verbruggen (nico.verb@gmail.com)
*/

var map;
var marker = null;

$(function(){
	// Initialize map on page load
	// Resize #map width to fix tile load
	$("#map").width = $(window).width();
	// Set map focus on Ghent
	map = L.map('map').setView([51.0500, 3.7167], 13);
	// Set tile layer
	L.tileLayer('http://{s}.tile.cloudmade.com/afc69fb2d6c141be80f34cb6e00099d7/101830/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 18
    }).addTo(map);
	// Hide map
	$("#map").css("display","none");
});

// Add a marker (only one allowed!)
function initMarker(lat, long){
	if (marker !== null){
		// If a marker is present, remove it
		map.removeLayer(marker);
	}
	// Show the map if it was hidden
	$("#map").css("display","block");
	// Add marker to map
    marker = L.marker([lat,long]).addTo(map);
    marker.bindPopup("<b>This is the location for your spotting.</b>").openPopup();
	// Zoom to marker
	map.setView([lat, long], 16);
}

/******************************************************************************/
// GET COORDINATES FROM GEOLOCATION
/******************************************************************************/

$("#autolocation").click(function(){
	// Asks the browser to get the current location
	// If it doesn't work, you get an alert
	 if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(GetLocation, geo_error);
        } else {
            error('Geolocation is not supported.');
        }
});

function GetLocation(location) {
	initMarker(location.coords.latitude, location.coords.longitude);
};

function geo_error(err) {
    if (err.code === 1) {
        error('The user denied the request for location information.');
    } else if (err.code === 2) {
        error('Your location information is unavailable.');
    } else if (err.code === 3) {
        error('The request to get your location timed out.');
    } else {
        error('An unknown error occurred while requesting your location.');
    }
}

/******************************************************************************/
// GET COORDINATES FROM ADDRESS
/******************************************************************************/

$("#streetlocation").click(function(){
	checkLocation();
});

function checkLocation(){
	var address = $('#location_street').val();
	if (address) {
		// use Google Maps API to geocode the address
		// set up the Geocoder object
		var geocoder = new google.maps.Geocoder();
		// return the coordinates
		geocoder.geocode({ 'address': address }, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
	                    if (results[0]) {
	                        // print results
	                        printLatLong(results[0].geometry.location.lat(),
	                            results[0].geometry.location.lng());
	                    } else {
	                        error('Google did not return any results.');
	                    }
	 
	                } else {
	                    error("Reverse Geocoding failed due to: " + status);
	                }
	            });
	}
	else {
		error('Please enter an address');
	}
}
 
// output lat and long
function printLatLong(lat, long) {
	initMarker(lat, long);
}

function error(msg) {
    alert(msg);
}

/******************************************************************************/

// PATH TO API FOR SPOTS
var _createSpotPath = "http://" + window.location.host.toString() + "/Code9000/api/spots/create";