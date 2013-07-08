<?php
/**
9K API
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
Stefaan Christiaens (stefaan.ch@gmail.com)
**/

include_once('routes.php');
include_once('utils/connectiondb.php');

$app->get('/api/', function () use ($app) {
    $app->render('api.phtml');
});

$app->get('/api/spots', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    
    $sql = "select * from spots";
    echo(json_encode(GetDatabaseObj($sql)));
});

$app->get('/api/cityprojects', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    
    $sql = "select * from cityprojects";
    echo(json_encode(GetDatabaseObj($sql)));
});

$app->get('/api/cityproposals', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    
    $sql = "select * from cityproposals";
    echo(json_encode(GetDatabaseObj($sql)));
});

$app->get('/api/comments', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    
    $sql = "select * from comments";
    echo(json_encode(GetDatabaseObj($sql)));
});

$app->get('/api/locations', function () use ($app) {
    $app->response()->header('Content-Type', 'application/json');
    
    $sql = "select * from locations";
    echo(json_encode(GetDatabaseObj($sql)));
});

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


$app->get('/api/users', function () use ($app) {
    
    //ONLY IF ADMIN!!!
    
    //$app->response()->header('Content-Type', 'application/json');
    
    $sql = "select * from users";
    echo('Are you admin boy');
    //echo(json_encode(GetDatabaseObj($sql)));
});

/***
 * LOGIN USER ???? IN API OR NOT?
 ***/
$app->post('/api/user/login/:email/:password', function ($email, $password) use ($app) {
    //ESCAPE EMAIL AND PASSWORD
    //$app->response()->header('Content-Type', 'application/json');
    
    $sql = "select password, role from users where email = :email";
    $vars = array(":email" => $email);
    $user = GetDatabaseObj($sql);
    $pass = $user['password'];
    //hash and salt password from post
    $hashed = "";
    if ($hashed == $pass) {
        //AUTHENTICATED
        return "200";
    }
    else 
    {
        return "404";
    }
});