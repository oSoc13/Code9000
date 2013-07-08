<?php
/**
9K API
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
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
/* SPOTS
/******************************************************************************/

$app->get('/api/spots', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    
    $sql = "select * from spots";
    echo(json_encode(GetDatabaseObj($sql)));
});

/******************************************************************************/
/* CITY PROJECTS
/******************************************************************************/

$app->get('/api/cityprojects', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    
    $sql = "select * from cityprojects";
    echo(json_encode(GetDatabaseObj($sql)));
});

/******************************************************************************/
/* CITY PROPOSALS
/******************************************************************************/

$app->get('/api/cityproposals', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    
    $sql = "select * from cityproposals";
    echo(json_encode(GetDatabaseObj($sql)));
});

/******************************************************************************/
/* COMMENTS
/******************************************************************************/

$app->get('/api/comments', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "select * from comments";
    echo(json_encode(GetDatabaseObj($sql)));
});

/******************************************************************************/
/* LOCATIONS
/******************************************************************************/

$app->get('/api/locations', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    
    $sql = "select * from locations";
    echo(json_encode(GetDatabaseObj($sql)));
});

/******************************************************************************/
/* PHOTOS
/******************************************************************************/

$app->get('/api/photos', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    
    $sql = "select * from photos";
    echo(json_encode(GetDatabaseObj($sql)));
});

$app->put('/api/photo/:name', function ($name) use ($app) {
    $requestBody = $app->request()->getBody();
    $data = json_decode($requestBody);
    var_dump($data);
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
		$sql = "select user_id, email, role, dateofbirth, firstname, surname, avatar, createddate, modifieddate, lastloggedindate from users";
		echo(json_encode(GetDatabaseObj($sql)));
	}else{
		// If the session does not exist, or you do not have admin permissions
		echo('You have to be an administrator in order to access user accounts.');
	}
});

/**
 * Get user data for one specific user. Available to the general public, only
 * shows id, name and avatar.
 */
$app->get('/api/users/:id', function ($id) {
	// Check if administrator permissions are set for current user
	if (isset($_SESSION['9k_admin']) && $_SESSION['9k_admin'] === true){
		// Session variable 9k_admin needs to exist + needs to be true
		$execute = array(":id"=>$id);
		// SQL query (is prepared and then executed)
		$sql = "SELECT user_id, email, role, dateofbirth, firstname, surname, avatar, createddate, modifieddate, lastloggedindate FROM users WHERE user_id = :id";
		// Get data and put it in $data
		$data = GetDatabaseObj($sql, $execute);
		if ( $data == null){
			// If data is empty, tell user that the record does not exist
			$ERR_NO_DATA = array("error"=>"No data available");
			echo(json_encode($ERR_NO_DATA));
		}else{
			// If data is not empty, show it (encoded as JSON)
			echo(json_encode($data));
		}
	// If no admin permissions are available (e.g. simple call to api from app)
	// users can get some information for a specific user ID
	}else{
		$execute = array(":id"=>$id);
		$sql = "SELECT user_id, firstname, surname, avatar FROM users WHERE user_id = :id";
		// Get data and put it in $data
		$data = GetDatabaseObj($sql, $execute);
		if ( $data == null){
			// If data is empty, tell user that the record does not exist
			$ERR_NO_DATA = array("error"=>"No data available");
			echo(json_encode($ERR_NO_DATA));
		}else{
			// If data is not empty, show it (encoded as JSON)
			echo(json_encode($data));
		}
	}
});