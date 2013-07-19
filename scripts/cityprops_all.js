/*
Javascript to show all the items
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
Nico Verbruggen (nico.verb@gmail.com)
---------
 */

var marker;
var map;

$("#mapbutton").click(function(){
	$("#spotmap").show();
	$("#spotlist").hide();
	$(this).hide();
	$("#listbutton").show();
});

$("#listbutton").click(function(){
	$("#spotmap").hide();
	$("#spotlist").show();
	$(this).hide();
	$("#mapbutton").show();
});

$(function(){
	loadMap();
	loadData();
	$("#mapbutton").hide();
	$("#spotlist").hide();
});

function showPicture(img){
	if (img !== null){
		return "<img class='spotimg' src='/Code9000/uploads/" + img + "'/>";
	}else{
		return "";
	}
}

function initMarker(lat, long, id, name, description, up, down, date){
    
	$("#map").width = $(window).width();
	// Show the map if it was hidden
	$("#map").css("display","block");
	// Add marker to map
    marker = L.marker([lat, long]).addTo(map);
    marker.bindPopup("<a class='markera' href='/Code9000/spots/" + id + "'>" +
			"<div>" +
			"<h3>" + name + "</h3>" + 
			"<p class='vote'>Score: " + (up - down) +
			"<span class='upvote'>+" + up + "</span>" +
			"<span class='downvote'>-" + down + "</span></p></div></a>");
}

function addSpot(id, name, description, up, down, date){
	var element = "<a class='spotlink' href='/Code9000/cityproposals/" + id + "'>" +
			"<div class='spotcontent'><section><h3>" + name + "<span class='dateaccent'>"+ date +"</span></h3>" + 
			"<p>Description: " + description + "</p>" +
			"<p class='vote'>Score: " + (up - down) +
			"<span class='upvote'>+" + up + "</span>" + 
			"<span class='downvote'>-" + down + "</span></p>" +
			"</section></div></a>";
	$("#spotlist").append(element);
}

function loadData(){

	$.ajax({
			type: "GET",
			dataType: "json",
			contentType: "application/json",
			cache: false,
			url: _root,
			beforeSend: function(xhr){
			},
			success: function(data){
				$.each(data, function(i, element){
					var finalcoords = Array;
					finalcoords = element.coords.split(" ");
					var lat = finalcoords[0].substr(1);
					var long = finalcoords[1].substr(0,finalcoords[1].length-2);
					console.log(lat);
					console.log(long);
					initMarker(lat, long, element.cityproposal_id, element.name, element.description, element.upvotes, element.downvotes, element.createddate);
					addSpot(element.cityproposal_id, element.name, element.description, element.upvotes, element.downvotes, element.createddate);
				});
			},
			error: function(){

			}
	});
}

function loadMap(){
	// Initialize map on page load
	// Resize #map width to fix tile load
	$("#map").width = $(window).width();
	// Set map focus on Ghent
	map = L.map('map').setView([51.0500, 3.7167], 13);
	// Set tile layer
	L.tileLayer('http://{s}.tile.cloudmade.com/afc69fb2d6c141be80f34cb6e00099d7/101830/256/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
        maxZoom: 20
    }).addTo(map);
}

var _root = "http://" + window.location.host.toString() + "/Code9000/api/cityproposals";