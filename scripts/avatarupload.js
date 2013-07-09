/**
UPLOADER.JS
For uploading those images in the background.
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
Nico Verbruggen (nico.verb@gmail.com)
Stefaan Christiaens (stefaan.ch@gmail.com)
*/

$(function(){

$("#confirm").click(function(){
	returnJSON();
});

});

// IMAGE PATH FOR UPLOADS FOLDER
var _uploadImagePath = "http://" + window.location.host.toString() + "/Code9000/upload";
// PATH TO API FOR UPLOADS
var _confirmUploadPath = "http://" + window.location.host.toString() + "/Code9000/api/photo";
// POINTER TO COUNT AMOUNT OF IMAGES
var pointer = 0;

$("#file").on('change', createUploads);

function createUploads(e){
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
                $("body").append("<p>An error occurred while uploading the avatar. Please try again later.</p>");
            break;
            // If invalid file, let user know about this
            case "InvalidFile":
                $("body").append("<p>The avatar you provided is invalid. Please select a valid image. GIFs are not allowed.</p>");
                break;
                // If the upload works, make the image appear on the page with a description
            default:
                var hid = evt.target.responseText.replace('\\','\\\\');
                var hid = hid.replace('/','\\\\');
                console.log('source: ' + evt.target.responseText);
                var url = evt.target.responseText.split('\\').join('/');
                console.log('url: ' + url);
                
                $("#avatar").html("<image src='http://" + url + "'/><input type='hidden' name='avatarpic' value='"+hid.split('\\')[hid.split('\\').length-1]+"' />");
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

function returnJSON(){
	
	var JSONdata = [];
	
	$("body").find(".complete").each(function (i, val){
		var obj = {};
		obj.src = $(val).find("textarea").data('id').split("/")[$(val).find("textarea").data('id').split("/").length-1];
		JSONdata.push(obj);
	});
	
	var data = JSON.stringify(JSONdata);
	
    $.ajax({
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        cache: false,
        data: data,
        url: _confirmUploadPath,
        beforeSend: function(xhr) {
            //
        },
        success: function(data_returned){
            console.log(data_returned);
        }
    });
}