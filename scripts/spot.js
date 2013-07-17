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
var _user = 0;

var edit = false;

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
	$("#spotTitle").html(data.description);
    var s = "";
    s+= "<section>";
    s+= "<h3>Problem or</h3><p>" + data.description +"</p>";
    s+= "<h3>Proposal</h3><p>" + data.proposed +"</p>";
    s+= "<h3>Created</h3><p>" + data.createddate +"</p>";
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
    s+= "<div id='comm_inh'>Comments</div>";
    s+= "<textarea id='comm_text' placeholder='Fill in your comment.'></textarea>";
    s+= "<input type='button' value='Comment' onclick='comment()' id='comment_enter' />";
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
            console.log("user " + id + " not found.");
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
        url: _root + "/api/spots/" + spot + "/comments",
        success: function(data){
            var comments = data.comments;
            _user = data.user;
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
        s+="<p id='"+ comments[i].comment_id +"-comment'><span class='text'>" + comments[i].text + " ";
        s+="</span><span>By " + comments[i].firstname + " " + comments[i].surname + " <strong>" + comments[i].modifieddate +"</strong></span></p>";
        if (_user == comments[i].user_id) {
            s+= "<input type='button' value='edit comment' onclick='editComment("+ comments[i].comment_id +")' />";
            s+= "<input type='button' value='delete comment' onclick='deleteComment("+ comments[i].comment_id +")' />";
        }
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
        url: _root + "/api/spots/" + spot_id + "/voteup",
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
        url: _root + "/api/spots/" + spot_id + "/votedown",
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

function comment()
{
    
    if ($("#comm_text").val() == "") {
        alert("Can't comment with empty comment sherlock.");
    }
    else
    {
        var url = "";
        var dataS = null;
        if (edit)
        {
            url = _root + "/api/spots/"+spot_id+"/comments/" + $("#comm_text").data('id');
            dataS = {"text":$("#comm_text").val()};
        }
        else
        {
           url = _root + "/api/spots/"+spot_id+"/comments";
           dataS = {"text":$("#comm_text").val()};
        }
        dataS =JSON.stringify(dataS);
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            cache: false,
            data: dataS,
            url: url,
            success: function(data){
                $("#comm_text").val('');
                edit = false;
                $("#comm_text").data('id', "");
                $("#comment_enter").val('Comment');
                getComments(spot_id);
            },
            error: function(xhr){
                edit = false;
                $("#comm_text").data('id', "");
                $("#comment_enter").val('Comment');
                console.log(xhr);
            }
        });
    }
}

function editComment(id){
    edit = true;
    $("#comm_text").goTo();
    $("#comm_text").val(($("body").find("#" + id + "-comment .text").html()));
    $("#comm_text").data('id',id);
    $("#comment_enter").val('Edit');
    
}

function deleteComment(id){
    if(window.confirm("Are you sure you want to delete your comment?"))
    {
        $.ajax({
            type: "DELETE",
            dataType: "json",
            contentType: "application/json",
            cache: false,
            data: JSON.stringify({"lol":1}),
            url: _root + "/api/spots/"+spot_id+"/comments/" + id,
            success: function(data){
                getComments(spot_id);
            },
            error: function(xhr){
                console.log(xhr);
            }
        });
    }
}

(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this;
    }
})(jQuery);