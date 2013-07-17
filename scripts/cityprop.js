/**
CityProposals.JS
Because we want to discuss projects.
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
        url: _root + "/api/cityproposals/" + prop_id,
        success: function(data){
            voted = data.voted;
            showLocation(data[0].coords.split(" ")[0].substr(1), data[0].coords.split(" ")[1].substr(0, data[0].coords.split(" ")[1].length-2));
            showData(data[0]);
        },
        error: function(){
            //window.location= _root + "/404";
        }
    });
}


// Add a marker (only one allowed!)
function showLocation(lat, lng){
    
    $("#map").width = $(window).width();

    if (marker !== null){
        // If a marker is present, remove it
        map.removeLayer(marker);
    }

    // Add marker to map
    marker = L.marker([lat,lng]).addTo(map);
    marker.bindPopup("<b>This is the location of the project.</b>");
    // Zoom to marker
    map.setView([lat,lng], 15);
}

function showData(data){
    var s = "";
    s+= "<section>";
    s+= "<h3 class='italic uppercase negative'>"+ htmlEncode(data.name) +"</h3>";
    s+= "<p>Description: "+ htmlEncode(data.description) +"</p>";
    s+= "<p>Created: "+ data.createddate +"</p>";
    s+= "<p class='btnFL'>Likes: <span id='up'>"+ data.upvotes +"</span></p>";
    if (!voted) {
        s+= "<input type='button' id='upbtn' value='Fancy that!' onclick='voteup()' />";
    }
    
    s+= "<p class='btnFL'>Dislikes: <span id='down'>"+ data.downvotes +"</span></p>";
    if (!voted) {
        s+= "<input type='button' id='downbtn' value='I do not get it..' onclick='votedown()' />";
    }
    
    s+= "<div id='comments'>";
    s+= "<h3 class='italic uppercase negative marginTop'>What do people think?</h3>";
    s+= "<div id='comm_inh'>Comments</div>";
    s+= "<textarea id='comm_text' placeholder='Fill in your comment.'></textarea>";
    s+= "<input type='button' value='Comment' onclick='comment()' id='comment_enter' />";
    s+= "</div>";
    s+= "</section>";
    $("#prop_content").html(s);
    
    
    getComments(data.spot_id);
    
    
}

function getComments(prop)
{
    $.ajax({
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        url: _root + "/api/cityproposals/" + prop_id + "/comments",
        success: function(data){
            var comments = data.comments;
            parseComments(comments);
            _user = data.user;
        },
        error: function(){
            $("#comm_inh").html("No comments for this project.");
        }
    });
}

function parseComments(comments)
{
    s= "";
    for (i = 0; i < comments.length; i++) {
        s+="<p id='"+ comments[i].comment_id +"-comment'><span class='text'>" + htmlEncode(comments[i].text) + " ";
        s+="</span><span>By " + htmlEncode(comments[i].firstname) + " " + htmlEncode(comments[i].surname) + " <strong>" + (comments[i].modifieddate == null?comments[i].createddate:comments[i].modifieddate) +"</strong></span></p>";
        
        console.log("User: " + _user + ". commentuser: " + comments[i].user_id);

        if (_user == comments[i].user_id) {
            s+= "<input type='button' value='edit comment' onclick='editComment("+ comments[i].comment_id +")' />";
            s+= "<input type='button' value='delete comment' onclick='deleteComment("+ comments[i].comment_id +")' />";
        }
        s+="<img src='"+ _root +"/uploads/"+ comments[i].avatar + "' />";
        s+="<hr/>";
    }
    if (comments.length == 0) {
        s = "No comments for this project.";
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
        url: _root + "/api/cityproposals/" + prop_id + "/voteup",
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
        url: _root + "/api/cityproposals/" + prop_id + "/votedown",
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
            url = _root + "/api/cityproposals/"+prop_id+"/comments/" + $("#comm_text").data('id');
            dataS = {"text":$("#comm_text").val()};
        }
        else
        {
           url = _root + "/api/cityproposals/"+prop_id+"/comments";
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
                getComments(prop_id);
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
            url: _root + "/api/cityproposals/"+prop_id+"/comments/" + id,
            success: function(data){
                getComments(prop_id);
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