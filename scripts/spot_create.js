/**
SPOT.JS
Because we want to spot things.
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
Nico Verbruggen (nico.verb@gmail.com)
*/

// IMAGE PATH FOR UPLOADS FOLDER
var _uploadImagePath = "http://" + window.location.host.toString() + "/Code9000/upload";
// PATH TO API FOR SPOTS
var _createSpotPath = "http://" + window.location.host.toString() + "/Code9000/api/spots/create";
// Map variable
var map;
// Marker
var marker = null;
// Pointer
var pointer = 0;
// Kind (spot or location)
var kind = "";
// Latitude to be saved
var current_lat;
// Longitude to be saved
var current_long;
// Data (json)
var data;

$("#confirm").click(function(){
	returnJSON();
});

$("#cancel").click(function(){
	$("#Spotter").html("<p>Your spotting was cancelled. Please refresh the page if you want to try again.</p>");
});

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
	$("#map").width = $(window).width();
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
	current_lat = location.coords.latitude;
	current_long = location.coords.longitude;
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
	current_lat = lat;
	current_long = long;
	initMarker(lat, long);
}

function error(msg) {
    alert(msg);
}

/******************************************************************************/

$("#img_spot").on('change', createUploads);
$("#img_location").on('change', createUploads);

function createUploads(e){
	kind = e.currentTarget.id;
	uploadFiles(e.target.files);
}

function uploadFiles(files){
	console.log("File upload process begin.");
	 //ADD FILES
     for (var i = 0, file; file = files[i]; ++i) {
		pointer++;
		//UPLOAD THE FILE
		uploadFile(file, pointer);    
     }
}

function uploadFile(file, p){
			console.log("File upload process begin. For image number " + pointer);
			//CREATE FORMDATA OBJECT
            var formData = new FormData();
            //ADD FILE
            formData.append("image", file);
            //CREATE THE NEW REQUEST
            var xhr = new XMLHttpRequest();
            //REGISTER LISTENERS
            xhr.addEventListener("load", function (evt) {
            // Get response back
            console.log(evt.target.response);
            switch(evt.target.response){
                // If error, let user know an error has happened!
                case "ERROR":
                        $("body").append("<p>An error occurred. Please try again later.</p>");
                break;
                // If invalid file, let user know about this
                case "InvalidFile":
                        $("body").append("<p>The file you provided is invalid. Please select a valid image. GIFs are not allowed.</p>");
                        break;
                        // If the upload works, make the image appear on the page with a description
                default:
                    switch (kind){
                            case "img_location":
                                var url = evt.target.responseText.split("\\").join("/");
                                $("#locationimg").html("<img class='upload' src='http://" + url + "'/>");
                                break;
                            case "img_spot":
                                var url = evt.target.responseText.split("\\").join("/");
                                $("#spotimg").html("<img class='upload' src='http://" + url + "'/>");
                                break;
                            default:
                            break;
                    }
                    break;
            }
            }, false);
            xhr.addEventListener("error", function (evt) {
                console.log("There was an error attempting to upload the file.");
            }, false);
            xhr.addEventListener("abort", function (evt) {
                console.log("The upload has been canceled by the user or the browser dropped the connection.");
            }, false);
            xhr.open("POST", _uploadImagePath);
            xhr.send(formData);	
}

/******************************************************************************/

function returnJSON(){
	var JSONdata = {};
	
	// Ensure that no fields remain empty.
	if (current_lat !== null 
		&& current_long !== null 
		&& $("#what").val() !== "" 
		&& $("#solution").val() !== ""
	   )
		{
		JSONdata.title = $("#what").val();
		JSONdata.solution = $("#solution").val();

		JSONdata.lat = current_lat;
		JSONdata.long = current_long;

		// If no image is uploaded, set JSON property to null
		if ($('#locationimg img').length !== 0){
			JSONdata.location_img = $("#locationimg img").attr("src").split("/")[$("#locationimg img").attr("src").split("/").length-1];
		}else{
			JSONdata.location_img = null;
		}

		// If no image is uploaded, set JSON property to null
		if ($('#spotimg img').length !== 0){
			JSONdata.spot_img = $("#spotimg img").attr("src").split("/")[$("#locationimg img").attr("src").split("/").length-1];
		}else{
			JSONdata.spot_img = null;
		}

		// Make JSON of data, submit to API via AJAX request
		data = JSON.stringify(JSONdata);
		$.ajax({
			type: "POST",
			dataType: "json",
			contentType: "application/json",
			cache: false,
			data: data,
			url: _createSpotPath,
			beforeSend: function(xhr){
			},
			success: function(data){
				$("#Spotter").html("<p>" + data.status + "</p>");
			},
			error: function(){
				$("#Spotter").html("<p>Something went wrong with your request. Please try again later, our API might be down.</p>");
			}
		});
	}else{
		alert("Some fields were not filled in or your location was not found. Ensure a location has been selected and the fields were filled in. Image uploads are not required.");
	}
}

