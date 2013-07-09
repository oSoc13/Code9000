<?php
/**
9K API
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
Nico Verbruggen (nico.verb@gmail.com)
Stefaan Christiaens (stefaan.ch@gmail.com)
**/

/******************************************************************************/
/* INCLUDE FILES
/******************************************************************************/

include_once('routes.php');
include_once('config/Authentication.php');
include_once('utils/connectiondb.php');

/******************************************************************************/
/* RENDER API PAGE
/******************************************************************************/

$app->get('/api/', function () use ($app) {
    $app->render('api.phtml');
});

/******************************************************************************/
/* API FUNCTIONS
/******************************************************************************/

/**
 * Checks if the data provided is empty. If it is, response code 404 is sent
 * and "no data available" is shown.
 * 
 * @param array $data
 * @param Slim instance $app
 * @param error messsage $errormsg, default = "No data available"
 * @param status code $status, default = 404
 */

function CheckIfEmpty($data, $app, $errormsg = "No data available", $status = 404){
	if (empty($data)){
		$ERR_NO_DATA = array("error"=>$errormsg);
		echo(json_encode($ERR_NO_DATA));
		$app->response()->status($status);
	}else{
		echo(json_encode($data));
	}
}

/**
 * Shows an error message. If only $app is provided, the default message is:
 * "You do not have permission to view this page" with status code 401.
 *
 * @param Slim instance $app
 * @param error message $errormsg
 * @param status code $status
 */

function ShowError($app, $errormsg = "You do not have permission to view this page", $status = 401){
	$ERR_NO_DATA = array("error"=>$errormsg);
	echo(json_encode($ERR_NO_DATA));
	$app->response()->status($status);
}

/******************************************************************************/
/* LOCATIONS
/******************************************************************************/

/**
 * Gets all locations added to the database, returns JSON
 */

$app->get('/api/locations', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "SELECT * FROM locations";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**
 *  Gets all last 15 locations added to the database, returns JSON
 */

$app->get('/api/locations/last15', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "SELECT * FROM locations LIMIT 15";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**
 * Gets one single location added to the database, returns JSON
 */

$app->get('/api/locations/:id', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM locations WHERE location_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});

/**
 * Gets spots associated with a location with a specific id
 */

$app->get('/api/locations/:id/spots', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM spots WHERE location_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});


/******************************************************************************/
/* SPOTS
/******************************************************************************/

/**
 * Gets all spots added to the database, returns JSON
 */

$app->get('/api/spots', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "select * from spots";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**
 * Gets one single spot added to the database, returns JSON
 */

$app->get('/api/spots/:id', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM spots WHERE spot_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});

/******************************************************************************/
/* CITY PROJECTS
/******************************************************************************/

/**
 * Gets all city projects added to the database, returns JSON
 */

$app->get('/api/cityprojects', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "select * from cityprojects";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**
 * Gets one single cityproject added to the database, returns JSON
 */

$app->get('/api/cityprojects/:id', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM cityprojects WHERE cityproject_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});

/******************************************************************************/
/* CITY PROPOSALS
/******************************************************************************/

/**
 * Gets all city proposals added to the database, returns JSON
 */

$app->get('/api/cityproposals', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "select * from cityproposals";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**
 * Gets one specific city proposal added to the database, returns JSON
 */

$app->get('/api/cityproposals/:id', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM cityproposals WHERE cityproposal_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});


/******************************************************************************/
/* COMMENTS
/******************************************************************************/

/**
 * Gets all comments added to the database
 */

$app->get('/api/comments', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "select * from comments";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**
 * Get one specific comment added to the database, returns JSON
 */

$app->get('/api/comments/:id', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM comments WHERE comment_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});

/******************************************************************************/
/* PHOTOS
/******************************************************************************/

/**
 * Gets all photo information. Returns JSON.
 */

$app->get('/api/photos', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "SELECT * FROM photos";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**
 * Gets all last 15 photos uploaded to the database.
 */

$app->get('/api/photos/last15', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "SELECT * FROM photos LIMIT 15";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**
 * Gets all photo information for one specific image. Returns JSON.
 */

$app->get('/api/photos/:id', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM photos WHERE photo_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});

/**
 * Adds an image to the database. Returns JSON with success or failure status.
 */

$app->post('/api/photos', function () use ($app){
try{
	$requestBody = $app->request()->getBody();
	$data = json_decode($requestBody);
	// The array contains a series of pictures
	foreach ($data as $picture) {
		// Each image has a description and url
		$description = "";
		$url = "";
		// $picture contains both a src and alt
		foreach ($picture as $key => $val){
			if ($key == "src"){
				$url = $val;
			}
			if ($key == "alt"){
				// Ensure that description is not empty or just spaces
				if (strlen(trim($val)) == 0){
					$description = null;
				}else{
					$description = $val;
				}
			}
		}
		// For each image, query an addition
		$execute = array(":description"=>$description, ":url"=>$url);
		$sql = "INSERT INTO photos (description, url) VALUES (:description, :url)";
		// Execute query
		GetDatabaseObj($sql, $execute);
		}
	echo json_encode($var = array("status"=>"Your upload succeeded!"));
}
catch(Exception $e){
	echo json_encode($var = array("status"=>"failure uploading one or more images, more information: $e"));
	exit;
}
});

/******************************************************************************/
/* USERS
/******************************************************************************/

/**
 * Gets all user data. Only available when the session variable 9k_admin is set
 * to true.
 */
$app->get('/api/users', function () use ($app) {
	// Check if administrator permissions are set for current user
	if (isset($_SESSION['9k_admin']) && $_SESSION['9k_admin'] === true){
		// Session variable 9k_admin needs to exist + needs to be true
		$sql = "SELECT user_id, email, role, dateofbirth, firstname, surname, avatar, createddate, modifieddate, lastloggedindate FROM users";
		echo(json_encode(GetDatabaseObj($sql)));
	}else{
		// Default no permission error if no admin privileges are present
		ShowError($app);
	}
});

/**
 * Get user data for one specific user. Available to the general public, only
 * shows id, name and avatar.
 */
$app->get('/api/users/:id', function ($id) use ($app){
	// Check if administrator permissions are set for current user
	if (isset($_SESSION['9k_admin']) && $_SESSION['9k_admin'] === true){
		// Session variable 9k_admin needs to exist + needs to be true
		$execute = array(":id"=>$id);
		// SQL query (is prepared and then executed)
		$sql = "SELECT user_id, email, role, dateofbirth, firstname, surname, avatar, createddate, modifieddate, lastloggedindate FROM users WHERE user_id = :id";
		// Get data and put it in $data
		$data = GetDatabaseObj($sql, $execute);
		CheckIfEmpty($data, $app);
	// If no admin permissions are available (e.g. simple call to api from app)
	// users can get some information for a specific user ID
	}else{
		$execute = array(":id"=>$id);
		$sql = "SELECT user_id, firstname, surname, avatar FROM users WHERE user_id = :id";
		// Get data and put it in $data
		$data = GetDatabaseObj($sql, $execute);
		CheckIfEmpty($data, $app);
	}
});

/**
 * Gets all comments added to the database by a specific user
 */

$app->get('/api/users/:id/comments', function ($id) use ($app) {
    $app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM comments WHERE user_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});