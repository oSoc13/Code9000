/**
SPOT.JS
Because we want to spot things.
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
Stefaan Christiaens (stefaan.ch@gmail.com)
*/


// PATH TO root
var _root = "http://" + window.location.host.toString() + "/Code9000";
// Map variable
var map;
// Marker
var marker = null;

var voted = false;

$(function(){
    getData();
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
});



function getData(){
    $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: null,
        url: _root + "/api/spots/" + spot_id,
        success: function(data){
            voted = data.voted;
            showSpotLocation(data[0].coords.split(" ")[0].substr(1), data[0].coords.split(" ")[1].substr(0, data[0].coords.split(" ")[1].length-2));
            showData(data[0]);
        },
        error: function(){
            //window.location= _root + "/404";
        }
    });
}


// Add a marker (only one allowed!)
function showSpotLocation(lat, lng){
    
    $("#map").width = $(window).width();

    if (marker !== null){
        // If a marker is present, remove it
        map.removeLayer(marker);
    }

    // Add marker to map
    marker = L.marker([lat,lng]).addTo(map);
    marker.bindPopup("<b>This is the location for your spotting.</b>");
    // Zoom to marker
    map.setView([lat,lng], 16);
}

function showData(data){
    var s = "";
    s+= "<section>";
    s+= "<p>Description: "+ data.description +"</p>";
    s+= "<p>Proposal: "+ data.proposed +"</p>";
    s+= "<p>Created: "+ data.createddate +"</p>";
    s+= "<p>Upvotes: <span id='up'>"+ data.upvotes +"</span></p>";
    if (!voted) {
        s+= "<input type='button' id='upbtn' value='Fancy that!' onclick='voteup()' />";
    }
    
    s+= "<p>Downvotes: <span id='down'>"+ data.downvotes +"</span></p>";
    if (!voted) {
        s+= "<input type='button' id='downbtn' value='I do not get it..' onclick='votedown()' />";
    }
    
    s+= "<div id='user'>";
    s+= "<h2>User</h2>";
    s+= "<div id='user_inh'>Loading...</div>";
    s+= "</div>";
    s+= "<div id='comments'>";
    s+= "<h2>Comments</h2>";
    s+= "<div id='comm_inh'>Loading...</div>";
    s+= "</div>";
    s+= "</section>";
    $("#spot").html(s);
    
    
    getUser(data.user_id);
    getComments(data.spot_id);
    
    
}

function getUser(id)
{
    $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: null,
        url: _root + "/api/users/" + id,
        success: function(data){
            var user = data[0];
            parseUser(user);
        },
        error: function(){
            window.location= _root + "/404";
        }
    });
}
function parseUser(user)
{
    var s = "";
    s+= "<section>";
    s+= "<p>firstname: "+ user.firstname +"</p>";
    s+= "<p>surname: "+ user.surname +"</p>";
    s+= "<p>avatar: </p>";
    s+= "<img src='"+ _root +"/uploads/"+ user.avatar +"' />";
    s+= "</section>";
    $("#user_inh").html(s);
}

function getComments(spot)
{
    $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: null,
        url: _root + "/api/comments/spots/" + spot,
        success: function(data){
            var comments = data;
            parseComments(comments);
        },
        error: function(){
            $("#comm_inh").html("No comments for this spotting.");
        }
    });
}

function parseComments(comments)
{
    s= "";
    for (i = 0; i < comments.length; i++) {
        s+="<p>" + comments[i].text + " ";
        s+="<span>By " + comments[i].firstname + " " + comments[i].surname + "</span></p>";
        s+="<img src='"+ _root +"/uploads/"+ comments[i].avatar + "' />";
        s+="<hr/>";
    }
    if (comments.length == 0) {
        s = "No comments for this spotting.";
    }
    $("#comm_inh").html(s);
}

function voteup()
{
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: null,
        url: _root + "/api/spots/voteup/" + spot_id,
        success: function(data){
            if (data != "voted") {
                console.log("ok");
                var n = $("#up").html();
                var nn = parseInt(n);
                nn++;
                $("#up").html(nn);
            }
            $("#upbtn").remove();
            $("#downbtn").remove();
            
        },
        error: function(){
            //window.location= window.location
        }
    });
}

function votedown()
{
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: null,
        url: _root + "/api/spots/votedown/" + spot_id,
        success: function(data){
            if (data != "voted") {
                console.log("ok");
                var n = $("#down").html();
                var nn = parseInt(n);
                nn++;
                $("#down").html(nn);
            }
            $("#downbtn").remove();
            $("#upbtn").remove();
        },
        error: function(){
            //window.location= _root + "/404";
        }
    });
}