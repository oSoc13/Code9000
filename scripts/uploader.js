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
var _confirmUploadPath = "http://" + window.location.host.toString() + "/Code9000/api/photos";
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
						$("body").append("<p>An error occurred. Please try again later.</p>");
					break;
					// If invalid file, let user know about this
					case "InvalidFile":
						$("body").append("<p>The file you provided is invalid. Please select a valid image. GIFs are not allowed.</p>");
						break;
						// If the upload works, make the image appear on the page with a description
					default:
						$("#UploadedFiles").append("<div class='complete'><div class='uploadframe'><img class='upload' src='http://" + evt.target.responseText + "'/></div><textarea rows='4' cols='50' data-id='" + evt.target.responseText + "' placeholder='Enter your image description here.'></textarea></div>");
						$("#LastUploaded").html("<image src='http://" + evt.target.responseText + "'/>");
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
		obj.alt = $(val).find("textarea").val();
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
        beforeSend: function(xhr){
        },
        success: function(data){
			$("#Uploader").html("<p>" + data.status + "</p>");
		}
		});
}