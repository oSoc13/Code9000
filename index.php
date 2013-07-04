<?php

/**
9K ROUTER
---------
# COPYRIGHT
(c) 2013, OKFN. All rights reserved.

# AUTHOR
Nico Verbruggen (nico.verb@gmail.com)
*/

include_once('routes.php');

/***********************
* REDBEANPHP
***********************/

require 'framework/rb.php';

/***********************
* SLIM FRAMEWORK
* INITIALIZATION
***********************/

require 'vendor/slim/slim/Slim/Slim.php';
// Register autoloader
\Slim\Slim::registerAutoloader();
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
