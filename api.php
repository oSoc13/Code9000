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
    INCLUDE FILES
    -------------
/******************************************************************************/

include_once('routes.php');
include_once('config/Authentication.php');
include_once('utils/connectiondb.php');




/******************************************************************************/
    RENDER API PAGE
    ---------------
/******************************************************************************/

$app->get('/api/', function () use ($app) {
    $app->render('api.phtml');
});




/******************************************************************************/
    API FUNCTIONS
    -------------
/******************************************************************************/

/**

    Checks if the data provided is empty. If it is, response code 404 is sent
    and "no data available" is shown.
    
    @param array $data
    @param Slim instance $app
    @param error messsage $errormsg, default = "No data available"
    @param status code $status, default = 404

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

    Calculate the distance between two coodinates in the given unit system
    
    @param decimal $lat1
    @param decimal $lon1
    @param decimal $lat2
    @param decimal $lon2
    @param string $unit
    @return decimal

 */
function distance($lat1, $lon1, $lat2, $lon2, $unit) 
{
    $theta = $lon1 - $lon2;
    $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
    $dist = acos($dist);
    $dist = rad2deg($dist);
    $miles = $dist * 60 * 1.1515;
    $unit = strtoupper($unit);

    if ($unit == "K") {
      return ($miles * 1.609344);
    } else if ($unit == "N") {
        return ($miles * 0.8684);
      } else {
          return $miles;
        }
}

/**

    Shows an error message. If only $app is provided, the default message is:
    "You do not have permission to view this page" with status code 401.
    
    @param Slim instance $app
    @param error message $errormsg
    @param status code $status

 */

function ShowError($app, $errormsg = "You do not have permission to view this page", $status = 401){
	$ERR = array("error"=>$errormsg);
	echo(json_encode($ERR));
	$app->response()->status($status);
}






/******************************************************************************/
    LOCATIONS
    ---------
/******************************************************************************/

/**

    Get all locations

 */
$app->get('/api/locations', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "SELECT * FROM locations";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**

    Get last 15 locations

 */
$app->get('/api/locations/last15', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "SELECT * FROM locations LIMIT 15";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**

    Get one single location

 */
$app->get('/api/locations/:id', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM locations WHERE location_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});


/**

    Get spots associated with a location with a specific id

 */
$app->get('/api/locations/:id/spots', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM spots WHERE location_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});













/******************************************************************************/
    SPOTS
    -----
/******************************************************************************/

/**

    Get all spots

 */
$app->get('/api/spots', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "select * from spots";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**

    Get all spots from a specific user

 */
$app->get('/api/users/:id/spots', function ($id) use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "select * from spots s
    Inner join ls.location_id = l.location_id  where user_id=:id";
    $vars = array('id' => $id);
    $data = GetDatabaseObj($sql, $vars);
    CheckIfEmpty($data, $app);
});

/**

    Add a new spot to the database

    The location is calculated in a way that no spots will be apart less then 50 meters
    If the spots are closer, the first added spotlocation is appointed to the second on to create spotclusters

 */
$app->post('/api/spots/create', function () use ($app) {
	try{
            $requestBody = $app->request()->getBody();
            $data = json_decode($requestBody);
            if (!isset($_SESSION['9K_USERID'])) {
                echo json_encode($var = array("status"=>"Not logged in."));exit();
            }
            $id = $_SESSION['9K_USERID'];

            // Four different parameter sets
            $photospot_params = array(":spot_img"=>$data->spot_img);
            $location_params = array(":latlong"=>"[$data->lat $data->long]",":user_id"=>$id);
            $spot_params = array(":title"=>$data->title,":solution"=>$data->solution,":user_id"=>$id);

            // If the spot_img provided is null (no image)
            if ($data->spot_img == null){
                    // Set spot image id to null
                    $spot_params[":photospot_id"] = null;
            }else{
                    // First, insert spot photo in photos table
                    $photospotquery = "INSERT INTO photos (url) VALUES (:spot_img)";
                    // Do the query and add photo ID of spot image to spot parameters
                    $spot_params[":photospot_id"] = InsertDatabaseObject($photospotquery, $photospot_params);
            }

            //CHECK IF LOCATION IS IN RADIUS ( 50 meters) OF EXISTING LOCATION
            $nearbyLocations = array();

            $sql = "SELECT location_id, coords FROM locations";
            $locs = GetDatabaseObj($sql);

            $lat2 = $data->lat;
            $lon2 = $data->long;
            $unit = "K";
            $json = array();
            foreach ($locs as $point) {
                $p1 = $point['coords'];
                $lat1 = substr(explode(" ", $p1)[0],1);
                $lon1 = substr(explode(" ", $p1)[1],0, strlen(explode(" ", $p1)[1]-2));
                $dist = distance($lat1, $lon1, $lat2, $lon2, $unit)*1000;
                if($dist <= 50)
                {
                    $nearbyLocations[$point['location_id']] = $dist;
                }
            }  
            
            if (empty($nearbyLocations)) {
                $locationquery = "INSERT INTO locations (coords, user_id) VALUES (:latlong, :user_id)";
                // Do the query and add location ID of location to spot parameters
                $spot_params[":location_id"] = InsertDatabaseObject($locationquery, $location_params);
            }
            else {
                $results = array_keys($nearbyLocations, min($nearbyLocations));
                $spot_params[":location_id"] = $results[0];
            }


            // Now that our location exists, add the spot to the database
            $spotquery = "INSERT INTO spots (description, proposed, user_id, location_id, photo_id) VALUES (:title, :solution, :user_id, :location_id, :photospot_id)";
            $spotID = InsertDatabaseObject($spotquery, $spot_params);

            // Let the user know their input was successful
            echo json_encode($var = array("status"=>"Your spotting succeeded!", "spot_created" => $spotID));
	}
	catch(Exception $e){
            
            echo json_encode($var = array("status"=>"Your spotting failed. Please try again later!", "error" => $e->getMessage()));
	}
});

/**

    Get a single spot

 */
$app->get('/api/spots/:id', function ($id) use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $execute = array(":id"=>$id);
    $sql = "SELECT s.*, l.location_id, l.coords FROM spots s Inner Join locations l on s.location_id=l.location_id WHERE s.spot_id = :id";
    $data = GetDatabaseObj($sql, $execute);
    $uid = $_SESSION['9K_USERID'];
    $sqlcheck = "select * from 
        (
            select * from users_like_spots uls 
            where uls.user_id=:user_id and uls.spot_id = :spot_id 
        UNION 
            select * from users_dislike_spots uds 
            where uds.user_id=:user_id and uds.spot_id = :spot_id 
        ) result";
    
    $vars = array('user_id' => $uid, 'spot_id' => $id);
    $check = GetDatabaseObj($sqlcheck, $vars);
    if (!empty($check)) {
        $data['voted'] = true;
    }
    CheckIfEmpty($data, $app);
});


/**

    Vote up on a spotting

 */
$app->post('/api/spots/:id/voteup', function ($id) use ($app) {
    $uid = $_SESSION['9K_USERID'];
   $sqlcheck = "select * from 
        (
            select * from users_like_spots uls 
            where uls.user_id=:user_id and uls.spot_id = :spot_id 
        UNION 
            select * from users_dislike_spots uds 
            where uds.user_id=:user_id and uds.spot_id = :spot_id 
        ) result";
   
    $vars = array('user_id' => $uid, 'spot_id' => $id);
    $check = GetDatabaseObj($sqlcheck, $vars);
    if (empty($check)) {
        $execute = array("id"=>$id, "user_id" => $uid);
	$sql = "UPDATE spots SET upvotes=(upvotes+1) WHERE spot_id = :id;Insert INTO users_like_spots (user_id, spot_id) values(:user_id,:id);";
	$data = UpdateDatabaseObject($sql, $execute);
	CheckIfEmpty($data, $app);
    }
    else
        echo 'voted';
    
	
});


/**

    Vote down on a spotting

 */
$app->post('/api/spots/:id/votedown', function ($id) use ($app) {
    $uid = $_SESSION['9K_USERID'];
    $sqlcheck = "select * from 
        (
            select * from users_like_spots uls 
            where uls.user_id=:user_id and uls.spot_id = :spot_id 
        UNION 
            select * from users_dislike_spots uds 
            where uds.user_id=:user_id and uds.spot_id = :spot_id 
        ) result";
    
    $vars = array('user_id' => $uid, 'spot_id' => $id);
    $check = GetDatabaseObj($sqlcheck, $vars);
    if (empty($check)) {
       $execute = array("id"=>$id, "user_id" => $uid);
	$sql = "UPDATE spots SET downvotes=(downvotes+1) WHERE spot_id = :id;Insert INTO users_dislike_spots (user_id, spot_id) values(:user_id,:id);";
	$data = UpdateDatabaseObject($sql, $execute);
	CheckIfEmpty($data, $app);
    }
    else
        echo 'voted';
});

/**

    Get all comments of a spotting

 */
$app->get('/api/spots/:id/comments', function($id) use ($app){
    $app->response()->header('Content-Type', 'application/json');
    $execute = array(":id"=>$id);
    $sql = "SELECT c.comment_id, c.text, c.modifieddate, u.avatar, u.firstname, u.surname, u.user_id FROM `comments` c
        RIGHT JOIN spots_has_comments sc
        ON sc.spot_id=:id AND sc.comment_id=c.comment_id
        Inner join users u on c.user_id=u.user_id
        Order By c.createddate DESC";
    
    $datac = GetDatabaseObj($sql, $execute);
    
    $data['comments'] = $datac;
    $data['user'] = $_SESSION['9K_USERID'];
    CheckIfEmpty($data, $app);
});

/**

    Insert a comment of a spotting

    postvars:
        text => comment text

 */
$app->post('/api/spots/:id/comments', function($id) use ($app){
    $requestBody = $app->request()->getBody();
    $data = json_decode($requestBody);
    try{
        $text = "";
        foreach ($data as $key => $val){
            if ($key == "text"){
                $text = $val;
            }
        }
        $user_id = $_SESSION['9K_USERID'];
        $vars = array("text"=>$text, "user_id" =>$user_id);
        $sql = "INSERT INTO comments (text, user_id) VALUES (:text, :user_id);";
        // Execute query
        $comment = InsertDatabaseObject($sql, $vars);
        
        $sqlAddCommentToSpot = "Insert INTO spots_has_comments(spot_id, comment_id) values(:spot_id, :comment_id)";
        $varsforadding = array('spot_id' => $id, 'comment_id' => $comment);
        
        GetDatabaseObj($sqlAddCommentToSpot, $varsforadding);
	echo json_encode($var = array("status"=>"OK"));
    }
    catch(Exception $e){
        echo json_encode($var = array("status"=>"Failed to comment. Here is some more information: $e"));
        exit;
    }
});

/**

    Edit a comment of a spotting
 
    postvars:
        text => comment text

 */
$app->post('/api/spots/:id/comments/:cid', function($id, $cid) use ($app){
    $requestBody = $app->request()->getBody();
    $data = json_decode($requestBody);
    try{
        $text = "";
        foreach ($data as $key => $val){
            if ($key == "text"){
                $text = $val;
            }
        }
        $user_id = $_SESSION['9K_USERID'];
        // For each image, query an addition
        $vars = array("text"=>$text, "id" =>$cid);
        $sql = "Update comments SET text= :text WHERE comment_id = :id;";
        // Execute query
        $count = UpdateDatabaseObject($sql, $vars);
        
	echo json_encode($var = array("status"=>"OK"));
    }
    catch(Exception $e){
        echo json_encode($var = array("status"=>"Failed to comment. Here is some more information: $e"));
        exit;
    }
});

/**

    Delete a comment of a spotting

 */
$app->delete('/api/spots/:id/comments/:cid', function($id,$cid) use ($app){
    try{
        //DELETE RELATION
        $varsR = array("id" =>$cid);
        $sqlR = "Delete FROM spots_has_comments WHERE comment_id = :id;";
        $countR = GetDatabaseObj($sqlR, $varsR);
        
        //DELETE ENTITYs
        $varsE = array("id" =>$cid);
        $sqlE = "Delete FROM comments  WHERE comment_id = :id;";
        // Execute query
        $countE = GetDatabaseObj($sqlE, $varsE);
        
	echo json_encode($var = array("status"=>"OK"));
    }
    catch(Exception $e){
        echo json_encode($var = array("status"=>"Failed to delete. Here is some more information: $e"));
        exit;
    }
});














/******************************************************************************/
    CITY PROJECTS
    -------------
/******************************************************************************/

/**

    Adds a new cityproject to the database

 */
$app->post('/api/cityproject/create', function () use ($app) {
    try{
        $req = $app->request();
        $name = trim($req->post('name'));
        $descr = trim($req->post('description'));
        $location = trim($req->post('location'));
        $data = trim($req->post('data'));

        if (!isset($_SESSION['9K_USERID'])) {
            echo json_encode($var = array("status"=>"Not logged in."));exit();
        }
        $id = $_SESSION['9K_USERID'];
        if (!isset($_SESSION['9K_ROLE'])) {
            if ($_SESSION['9K_ROLE'] != "admin") {
                echo json_encode($var = array("status"=>"You need to be an administrator to create a new city project"));exit();
            }
        }

        $sql = "insert into cityprojects(name,description,user_id,location_id,data) values (:name,:description,:user_id,:location_id,:data);";
        $vars = array("name" => $name, "description" =>$description, "user_id" => $id, "location_id" => $location_id, "data" => $data);
        $projId = InsertDatabaseObject($sql, $vars);
        echo json_encode($var = array("status"=>"OK", "id" => $projId));

    }
    catch(Exception $e){
            
        echo json_encode($var = array("status"=>"Your creation of a project failed. Please try again later!", "error" => $e->getMessage()));
    }

});

/**

    Adds a new cityproject to the database based on an project template made by an administrator

 */
$app->post('/api/cityproject/:parent_id/base', function ($parent_id) use ($app) {
    try{
        $req = $app->request();
        $name = trim($req->post('name'));
        $descr = trim($req->post('description'));
        $location = trim($req->post('location'));
        $data = trim($req->post('data'));

        if (!isset($_SESSION['9K_USERID'])) {
            echo json_encode($var = array("status"=>"Not logged in."));exit();
        }
        $id = $_SESSION['9K_USERID'];
        

        $sql = "insert into cityprojects(name,description,user_id,location_id,data, parent_cityproject) values (:name,:description,:user_id,:location_id,:data, :parent);";
        $vars = array("name" => $name, "description" =>$description, "user_id" => $id, "location_id" => $location_id, "data" => $data, "parent" => $parent_id);
        $projId = InsertDatabaseObject($sql, $vars);
        echo json_encode($var = array("status"=>"OK", "id" => $projId));

    }
    catch(Exception $e){
            
        echo json_encode($var = array("status"=>"Failed to adapt template. Please try again later!", "error" => $e->getMessage()));
    }

});

/**

    Update a cityproject based on an project template made by an administrator

 */
$app->post('/api/cityproject/:id', function ($id) use ($app) {
    try{
        $req = $app->request();
        $name = trim($req->post('name'));
        $descr = trim($req->post('description'));
        $data = trim($req->post('data'));

        if (!isset($_SESSION['9K_USERID'])) {
            echo json_encode($var = array("status"=>"Not logged in."));exit();
        }
        $id = $_SESSION['9K_USERID'];

        $sql = "UPDATE cityprojects SET name = :name, description = :description, data = :data;";
        $vars = array("name" => $name, "description" =>$description, "data" => $data);
        $count = UpdateDatabaseObject($sql, $vars);
        if ($count > 0) {
            echo json_encode($var = array("status"=>"OK", "count" => $count));
        }
        else
        {
            throw new Exception("No rows were updated.");
        }

    }
    catch(Exception $e){
            
        echo json_encode($var = array("status"=>"Failed to update playground. Please try again later!", "error" => $e->getMessage()));
    }

});

/**

    Get all cityprojects

 */
$app->get('/api/cityprojects', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "select * from cityprojects";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**

    Get one single cityproject

 */
$app->get('/api/cityprojects/:id', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM cityprojects WHERE cityproject_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});

/**

    Vote up on a cityproject

*/
$app->post('/api/cityprojects/:id/voteup', function ($id) use ($app) {
    $uid = $_SESSION['9K_USERID'];
   $sqlcheck = "select * from 
        (
            select * from users_like_cityprojects uls 
            where uls.user_id=:user_id and uls.cityproject_id = :cityproject_id 
        UNION 
            select * from users_dislike_cityprojects uds 
            where uds.user_id=:user_id and uds.cityproject_id = :cityproject_id 
        ) result";
   
    $vars = array('user_id' => $uid, 'cityprojects' => $id);
    $check = GetDatabaseObj($sqlcheck, $vars);
    if (empty($check)) {
        $execute = array("id"=>$id, "user_id" => $uid);
	$sql = "UPDATE cityprojects SET upvotes=(upvotes+1) WHERE cityproject_id = :id;Insert INTO users_like_cityprojects (user_id, cityproject_id) values(:user_id,:id);";
	$data = UpdateDatabaseObject($sql, $execute);
	CheckIfEmpty($data, $app);
    }
    else
        echo 'voted';
    
	
});

/**

    Vote down on a cityproject

*/
$app->post('/api/cityprojects/:id/votedown', function ($id) use ($app) {
    $uid = $_SESSION['9K_USERID'];
    $sqlcheck = "select * from 
        (
            select * from users_like_cityprojects uls 
            where uls.user_id=:user_id and uls.cityproject_id = :cityproject_id 
        UNION 
            select * from users_dislike_cityprojects uds 
            where uds.user_id=:user_id and uds.cityproject_id = :cityproject_id 
        ) result";
   
    $vars = array('user_id' => $uid, 'cityprojects' => $id);
    $check = GetDatabaseObj($sqlcheck, $vars);
    if (empty($check)) {
        $execute = array("id"=>$id, "user_id" => $uid);
	$sql = "UPDATE cityprojects SET downvotes=(downvotes+1) WHERE cityproject_id = :id;Insert INTO users_dislike_cityprojects (user_id, cityproject_id) values(:user_id,:id);";
	$data = UpdateDatabaseObject($sql, $execute);
	CheckIfEmpty($data, $app);
    }
    else
        echo 'voted';	
});

/**

    Get all comments of a cityproject

 */
$app->get('/api/cityprojects/:id/comments', function($id) use ($app){
    $app->response()->header('Content-Type', 'application/json');
    $execute = array(":id"=>$id);
    $sql = "SELECT c.comment_id, c.text, c.modifieddate, u.avatar, u.firstname, u.surname, u.user_id FROM `comments` c
        RIGHT JOIN cityprojects_has_comments sc
        ON sc.cityproject_id=:id AND sc.comment_id=c.comment_id
        Inner join users u on c.user_id=u.user_id
        Order By c.createddate DESC";
    
    $datac = GetDatabaseObj($sql, $execute);
    
    $data['comments'] = $datac;
    $data['user'] = $_SESSION['9K_USERID'];
    CheckIfEmpty($data, $app);
});

/**

    Insert a comment of a cityproject
 
    postvars:
        text => comment text

 */
$app->post('/api/cityprojects/:id/comments', function($id) use ($app){
    $requestBody = $app->request()->getBody();
    $data = json_decode($requestBody);
    try{
        $text = "";
        foreach ($data as $key => $val){
            if ($key == "text"){
                $text = $val;
            }
        }
        $user_id = $_SESSION['9K_USERID'];
        $vars = array("text"=>$text, "user_id" =>$user_id);
        $sql = "INSERT INTO comments (text, user_id) VALUES (:text, :user_id);";
        // Execute query
        $comment = InsertDatabaseObject($sql, $vars);
        
        $sqlAddCommentToSpot = "Insert INTO cityprojects_has_comments(cityproject_id, comment_id) values(:cityproject_id, :comment_id)";
        $varsforadding = array('cityproject_id' => $id, 'comment_id' => $comment);
        
        GetDatabaseObj($sqlAddCommentToSpot, $varsforadding);
	echo json_encode($var = array("status"=>"OK"));
    }
    catch(Exception $e){
        echo json_encode($var = array("status"=>"Failed to comment. Here is some more information: $e"));
        exit;
    }
});

/**

    Edit a comment of a cityproject
 
    postvars:
        text => comment text

 */
$app->post('/api/cityprojects/:id/comments/:cid', function($id, $cid) use ($app){
    $requestBody = $app->request()->getBody();
    $data = json_decode($requestBody);
    try{
        $text = "";
        foreach ($data as $key => $val){
            if ($key == "text"){
                $text = $val;
            }
        }
        $user_id = $_SESSION['9K_USERID'];
        // For each image, query an addition
        $vars = array("text"=>$text, "id" =>$cid);
        $sql = "Update comments SET text= :text WHERE comment_id = :id;";
        // Execute query
        $count = UpdateDatabaseObject($sql, $vars);
        
	echo json_encode($var = array("status"=>"OK"));
    }
    catch(Exception $e){
        echo json_encode($var = array("status"=>"Failed to comment. Here is some more information: $e"));
        exit;
    }
});

/**

    Delete a comment of a cityproject

 */
$app->delete('/api/cityprojects/:id/comments/:cid', function($id,$cid) use ($app){
    try{
        //DELETE RELATION
        $varsR = array("id" =>$cid);
        $sqlR = "Delete FROM cityprojects_has_comments WHERE comment_id = :id;";
        $countR = GetDatabaseObj($sqlR, $varsR);
        
        //DELETE ENTITYs
        $varsE = array("id" =>$cid);
        $sqlE = "Delete FROM comments  WHERE comment_id = :id;";
        // Execute query
        $countE = GetDatabaseObj($sqlE, $varsE);
        
	echo json_encode($var = array("status"=>"OK"));
    }
    catch(Exception $e){
        echo json_encode($var = array("status"=>"Failed to delete. Here is some more information: $e"));
        exit;
    }
});












/******************************************************************************/
    CITY PROPOSALS
    --------------
/******************************************************************************/

/**

    Gets all city proposals added to the database

 */
$app->get('/api/cityproposals', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "select * from cityproposals";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**

    Gets one specific city proposal added to the database

 */
$app->get('/api/cityproposals/:id', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM cityproposals WHERE cityproposal_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});

/**

    Vote up for a specific city proposal

*/
$app->post('/api/cityproposals/:id/voteup', function ($id) use ($app) {
    $uid = $_SESSION['9K_USERID'];
   $sqlcheck = "select * from 
        (
            select * from users_like_cityproposals uls 
            where uls.user_id=:user_id and uls.cityproposal_id = :cityproposal_id 
        UNION 
            select * from users_dislike_cityproposals uds 
            where uds.user_id=:user_id and uds.cityproposal_id = :cityproposal_id 
        ) result";
   
    $vars = array('user_id' => $uid, 'cityproposal_d' => $id);
    $check = GetDatabaseObj($sqlcheck, $vars);
    if (empty($check)) {
        $execute = array("id"=>$id, "user_id" => $uid);
	$sql = "UPDATE cityproposals SET upvotes=(upvotes+1) WHERE cityproposal_id = :id;Insert INTO users_like_cityproposals (user_id, cityproposal_id) values(:user_id,:id);";
	$data = UpdateDatabaseObject($sql, $execute);
	CheckIfEmpty($data, $app);
    }
    else
        echo 'voted';
});

/**

    Vote down for a specific city proposal

*/
$app->post('/api/cityproposals/:id/votedown', function ($id) use ($app) {
    $uid = $_SESSION['9K_USERID'];
    $sqlcheck = "select * from 
        (
            select * from users_like_cityproposals uls 
            where uls.user_id=:user_id and uls.cityproposal_id = :cityproposal_id 
        UNION 
            select * from users_dislike_cityproposals uds 
            where uds.user_id=:user_id and uds.cityproposal_id = :cityproposal_id 
        ) result";
   
    $vars = array('user_id' => $uid, 'cityproposal_d' => $id);
    $check = GetDatabaseObj($sqlcheck, $vars);
    if (empty($check)) {
        $execute = array("id"=>$id, "user_id" => $uid);
	$sql = "UPDATE cityproposals SET downvotes=(downvotes+1) WHERE cityproposal_id = :id;Insert INTO users_dislike_cityproposals (user_id, cityproposal_id) values(:user_id,:id);";
	$data = UpdateDatabaseObject($sql, $execute);
	CheckIfEmpty($data, $app);
    }
    else
        echo 'voted';
});

/**

    Get all comments of a citproposal

*/
$app->get('/api/cityproposals/:id/comments', function($id) use ($app){
    $app->response()->header('Content-Type', 'application/json');
    $execute = array(":id"=>$id);
    $sql = "SELECT c.comment_id, c.text, c.modifieddate, u.avatar, u.firstname, u.surname, u.user_id FROM `comments` c
        RIGHT JOIN cityproposals_has_comments sc
        ON sc.cityproposal_id=:id AND sc.comment_id=c.comment_id
        Inner join users u on c.user_id=u.user_id
        Order By c.createddate DESC";
    
    $datac = GetDatabaseObj($sql, $execute);
    
    $data['comments'] = $datac;
    $data['user'] = $_SESSION['9K_USERID'];
    CheckIfEmpty($data, $app);
});

/**

    Insert a comment of a cityproposal
    
    postvars:
        text => comment text

 */
$app->post('/api/cityproposals/:id/comments', function($id) use ($app){
    $requestBody = $app->request()->getBody();
    $data = json_decode($requestBody);
    try{
        $text = "";
        foreach ($data as $key => $val){
            if ($key == "text"){
                $text = $val;
            }
        }
        $user_id = $_SESSION['9K_USERID'];
        $vars = array("text"=>$text, "user_id" =>$user_id);
        $sql = "INSERT INTO comments (text, user_id) VALUES (:text, :user_id);";
        // Execute query
        $comment = InsertDatabaseObject($sql, $vars);
        
        $sqlAddCommentToSpot = "Insert INTO cityproposals_has_comments(cityproposal_id, comment_id) values(:cityproposal_id, :comment_id)";
        $varsforadding = array('cityproposal_id' => $id, 'comment_id' => $comment);
        
        GetDatabaseObj($sqlAddCommentToSpot, $varsforadding);
	echo json_encode($var = array("status"=>"OK"));
    }
    catch(Exception $e){
        echo json_encode($var = array("status"=>"Failed to comment. Here is some more information: $e"));
        exit;
    }
});

/**

    Edit a comment of a cityproposal
    
    postvars:
        text => comment text

 */
$app->post('/api/cityproposals/:id/comments/:cid', function($id, $cid) use ($app){
    $requestBody = $app->request()->getBody();
    $data = json_decode($requestBody);
    try{
        $text = "";
        foreach ($data as $key => $val){
            if ($key == "text"){
                $text = $val;
            }
        }
        $user_id = $_SESSION['9K_USERID'];
        // For each image, query an addition
        $vars = array("text"=>$text, "id" =>$cid);
        $sql = "Update comments SET text= :text WHERE comment_id = :id;";
        // Execute query
        $count = UpdateDatabaseObject($sql, $vars);
        
	echo json_encode($var = array("status"=>"OK"));
    }
    catch(Exception $e){
        echo json_encode($var = array("status"=>"Failed to comment. Here is some more information: $e"));
        exit;
    }
});

/**

    Delete a comment of a cityproposal

 */
$app->delete('/api/cityproposals/:id/comments/:cid', function($id,$cid) use ($app){
    try{
        //DELETE RELATION
        $varsR = array("id" =>$cid);
        $sqlR = "Delete FROM cityproposals_has_comments WHERE comment_id = :id;";
        $countR = GetDatabaseObj($sqlR, $varsR);
        
        //DELETE ENTITYs
        $varsE = array("id" =>$cid);
        $sqlE = "Delete FROM comments  WHERE comment_id = :id;";
        // Execute query
        $countE = GetDatabaseObj($sqlE, $varsE);
        
	echo json_encode($var = array("status"=>"OK"));
    }
    catch(Exception $e){
        echo json_encode($var = array("status"=>"Failed to delete. Here is some more information: $e"));
        exit;
    }
});







/******************************************************************************/
    COMMENTS
    --------
/******************************************************************************/

/**

    Get all comments
    
 */
$app->get('/api/comments', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "select * from comments";
    $data = GetDatabaseObj($sql);
    CheckIfEmpty($data, $app);
});

/**

    Get a specific comment
    s
 */
$app->get('/api/comments/:id', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM comments WHERE comment_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});















/******************************************************************************/
    PHOTOS
    ------
/******************************************************************************/

/**

    Get all photo information.

 */
$app->get('/api/photos', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "SELECT * FROM photos";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**

    Get last 15 photos.

 */
$app->get('/api/photos/last15', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    $sql = "SELECT * FROM photos LIMIT 15";
    $data = GetDatabaseObj($sql);
	CheckIfEmpty($data, $app);
});

/**

    Gets all photo information for one specific image.

 */
$app->get('/api/photos/:id', function ($id) use ($app) {
	$app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM photos WHERE photo_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});

/**

    Adds an image to the database.

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
    USERS
    -----
/******************************************************************************/

/**

    Gets all users. Only available when logged in as administrator

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

    Get user data for one specific user. Available to the general public, only
    shows id, name and avatar.

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

    Get all comments by a specific user

 */

$app->get('/api/users/:id/comments', function ($id) use ($app) {
    $app->response()->header('Content-Type', 'application/json');
	$execute = array(":id"=>$id);
	$sql = "SELECT * FROM comments WHERE user_id = :id";
	$data = GetDatabaseObj($sql, $execute);
	CheckIfEmpty($data, $app);
});

