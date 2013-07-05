<?php

/**
9K ROUTER
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
Nico Verbruggen (nico.verb@gmail.com)
Stefaan Christiaens (stefaan.ch@gmail.com)
*/

include_once('routes.php');

// import the Intervention Image Class
// http://intervention.olivervogel.net/ for documentation
use \Intervention\Image\Image;

/***********************
* SLIM FRAMEWORK
* INITIALIZATION
***********************/

require __DIR__ . DIRECTORY_SEPARATOR . 'vendor/autoload.php';

// Create new Slim() instance
$app = new \Slim\Slim();
// Debugging status (true during development, false when deployed)
$app->config('debug', true);
// Start a new session
session_start();
/* Set base url */
$app->hook('slim.before', function () use ($app) {
    $app->view()->appendData(array('baseURL' => BASE_URL_9K));
});

/***********************
* SLIM FRAMEWORK
* ROUTING
***********************/

$app->get('/', function () use ($app) {
    $app->render('index.phtml');
});

$app->get('/home', function () use ($app) {
    $app->render('index.phtml');
});

$app->get('/upload', function () use ($app) {
    $app->render('upload.phtml');
});

$app->get('/alerts', function () use ($app) {
    $app->render('alerts.phtml');
});

$app->get('/tips', function () use ($app) {
    $app->render('tips.phtml');
});

$app->get('/about', function () use ($app) {
    $app->render('about.phtml');
});

/***********************
* FILE UPLOAD
***********************/

$app->post('/upload', function () use ($app){
	
	// Include required for ensuring uploads end up in the correct folder!
	require PATH_WEBROOT . DIRECTORY_SEPARATOR . 'vendor/autoload.php';
 
	// Allowed extensions
	$allowedExts = array("gif", "jpeg", "jpg", "png", "GIF", "PNG", "JPG", "JPEG");
	$temp = explode(".", $_FILES["image"]["name"]);
	$extension = end($temp);
	if ((
		// Allowed filetypes (mimetypes)
        ($_FILES["image"]["type"] == "image/gif")
        || ($_FILES["image"]["type"] == "image/jpeg")
        || ($_FILES["image"]["type"] == "image/jpg")
        || ($_FILES["image"]["type"] == "image/pjpeg")
        || ($_FILES["image"]["type"] == "image/x-png")
        || ($_FILES["image"]["type"] == "image/png")
    )
		// Set max filesize
        && ($_FILES["image"]["size"] < 2000000)
        && in_array($extension, $allowedExts))
{
    if ($_FILES["image"]["error"] > 0)
    {
        echo "Return Code: " . $_FILES["image"]["error"] . "<br>";
    }
    else
    {    
		// Rename file based on microtime
        $milliseconds = round(microtime(true) * 1000);
        $name = $_FILES["image"]["name"] . $milliseconds;
		// Encodes filename
        $finalName = base64_encode($name) . "." . $extension;
		// Use Intervention to crop image
        $img = Image::make($_FILES["image"]["tmp_name"]);
        $img->resize(300, null, true)->encode('png', 20);
		// Save the image into the final directory with the final encoded name
        $img->save(PATH_WEBROOT . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . $finalName);
        // Return path to image
		echo($_SERVER['HTTP_HOST'] . DIRECTORY_SEPARATOR . BASE_URL_9K . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . $finalName);
    }
}
else
{
    echo "InvalidFile";
}
});

/***********************
* SLIM FRAMEWORK
* ERRORS + 404
***********************/

$app->error(function (\Exception $e) use ($app) {
	$errorData = array('error' => $e);
    $app->render('error.phtml', $errorData);
});

$app->notFound(function () use ($app) {
     // Output Response
     header("Status: 404 Not Found");
     $app->render('404.phtml');
});

/***********************
* SLIM FRAMEWORK
* RUN THE APP
***********************/

$app->run();

?>
