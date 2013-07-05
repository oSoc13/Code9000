/**
UPLOADER.JS
For uploading those images in the background.
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
Nico Verbruggen (nico.verb@gmail.com)
*/

$(function(){

});

var _uploadImagePath = "http://" + window.location.host.toString() + "/Code9000/upload";
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
			console.log("File upload process begin. For nr." + pointer);
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
					case "InvalidFile":
						$("body").append("<p>The file you provided is invalid. Please select a valid image. GIFs are not allowed.</p>");
						break;
					default:
						$("body").append("<image src='http://" + evt.target.responseText + "'/>");
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