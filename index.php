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
include_once(__DIR__ . DIRECTORY_SEPARATOR . 'utils' . DIRECTORY_SEPARATOR . 'Authentication.php');


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

include 'api.php';

$app->get('/', function () use ($app) {
    $app->render('index.phtml');
});

$app->get('/breakthissite', function () use ($app) {
    boom;
});

$app->get('/home', function () use ($app) {
    $app->render('index.phtml');
});

$app->get('/admin', function () use ($app) {
    $app->render('admin.phtml');
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

$app->get('/spottings', function () use ($app) {
    $app->render('spottings.phtml');
});

$app->get('/spots/create', function () use ($app) {
    $app->render('spot_create.phtml');
});

$app->get('/myspots/', function () use ($app){
	if (isset($_SESSION['9K_USERID']))
	{
        $data = array('id' => $_SESSION['9K_USERID']);
		$app->render('spots_user.phtml', $data);
	}
	else
	{
		$_SESSION["loginmsg"] = "Please login first before you can see your own spottings.";
		$app->render('login.phtml');
	}
});

$app->get('/help', function () use ($app) {
    $app->render('help.phtml');
});

$app->get('/leaflettest', function () use ($app) {
    $app->render('leaflet.phtml');
});
$app->get('/spots', function () use ($app) {
    $app->render('spots.phtml');
});


$app->get('/spots/:id', function ($id) use ($app) {
    $data = array('id'=>$id);
    $app->render('spot.phtml', $data);
});

$app->get('/cityproposals', function () use ($app) {
    $app->render('cityprops.phtml');
});

$app->get('/cityproposals/:id', function ($id) use ($app) {
    if (!isset($_SESSION['9K_USERID'])) {
        $app->redirect("/code9000/login");
    }
    else
    {
        $uid = $_SESSION['9K_USERID'];
    }
    $data = array('id'=>$id, 'user'=> $uid);
    $app->render('cityprop.phtml', $data);
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
        && ($_FILES["image"]["size"] < 20000000)
        && in_array($extension, $allowedExts))
{
    if ($_FILES["image"]["error"] > 0)
    {
        echo "ERROR";
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


/**********************
 * AUTHENTICATION
 *********************/
$app->get('/register', function () use ($app) {
    $app->render('register.phtml');
});

$app->post('/register', function () use ($app) {
    $req = $app->request();
    
    $fname =    trim($req->post('fname'     ));
    $sname =    trim($req->post('sname'     ));
    $email =    trim($req->post('email'     ));
    $dob =      trim($req->post('dob'       ));
    $pwd =      trim($req->post('password'  ));
    $admin =    trim($req->post('admin'     ));
    $photo =    trim($req->post('avatarpic' ));
    
    $test = array('fname' => $fname, 'sname' => $sname, 'email' => $email, 'dob' => $dob, 'pwd' => $pwd, 'admin' => $admin, 'avatar' => $photo );

    $auth = new Authentication();
    $auth->register($test);
    $app->redirect('/code9000');
});


$app->get('/activateaccount/:code/:email', function ($code, $email) use ($app) {
    $auth = new Authentication();
    $count = $auth->activateAccount($email, $code);
    if ($count > 0) {
        $app->redirect('/code9000/login');
    }
    else
    {
        throw new Exception("Activation details did not match any profile.");
    }
});

$app->get('/login/:message', function ($message) use ($app) {
    if(!empty($message))
    {
        $data = array('message' => $message);
    }
    $app->render('login.phtml', $data);
});

$app->get('/login', function () use ($app) {
    $app->render('login.phtml');
});

$app->get('/logout', function () use ($app) {
    session_unset();
    session_destroy();
    session_start();
    $app->redirect('/code9000/login/successfully logged out');
});


$app->post('/login', function () use ($app) {
    $req = $app->request();
    $email = trim($req->post('email'));
    $pwd = trim($req->post('password'));
    $auth = new Authentication();
    $result = $auth->login($email, $pwd);
    
    $msg = "";
    switch ($result) {
        case 'ACT':
            $msg ='Account not activated yet.';
            break;
        
        case 'PWD':
            $msg = 'Password incorrect.';
            break;
        
        case 'NO_USER':
            $msg = 'No user found with provided email.';
            break;
        
        case 'OK':
            $app->redirect('/code9000/spottings');
            break;
    }
	$_SESSION["loginmsg"] = $msg;
    $app->redirect('/code9000/login');
});

$app->get('/account', function () use ($app) {
    $data = array();
    if (isset($_SESSION['9K_USERID'])) {
        $id = $_SESSION['9K_USERID'];
        $sql = "SELECT * from users where user_id = :id";
        $var = array('id' => $id);
        $user = GetFirstDatabaseObject($sql, $var);
        $data['user'] = $user;
        $app->render('account.phtml', $data);
    }
 else {
	$_SESSION["loginmsg"] = "Please login first.";
    $app->redirect('/code9000/login');
    }
});

$app->get('/account/edit', function () use ($app) {
    $data = array();
    if (isset($_SESSION['9K_USERID'])) {
        $id = $_SESSION['9K_USERID'];
        $sql = "SELECT * from users where user_id = :id";
        $var = array('id' => $id);
        $user = GetFirstDatabaseObject($sql, $var);
        $data['user'] = $user;
        $app->render('account-edit.phtml', $data);
    }
 else {
    $app->redirect('/code9000/login');    
    }
});

$app->post('/account/edit', function () use ($app) {
    $req = $app->request();
    if (isset($_SESSION['9K_USERID'])) {
        $id = $_SESSION['9K_USERID'];
        $sql = "SELECT * from users where user_id = :id";
        $var = array('id' => $id);
        $user_pre = GetFirstDatabaseObject($sql, $var);
        $auth = new Authentication();
        $opw = trim($req->post('oldpassword'));
        $avatar = trim($req->post('avatarpic'));
        if($auth->checkPassword($user_pre['password'], $user_pre['passwordsalt'], $opw ))
        {
            $npwt = trim($req->post('newpassword'));
            if (empty($npwt)) {
                $user = array(
                       'firstname' =>      trim($req->post('firstname')),
                       'surname' =>        trim($req->post('surname')),
                       'dateofbirth' =>    trim($req->post('dateofbirth')),
                       'id' =>             $id
                    );
                if(!empty($avatar))
                    $user['avatar'] = $avatar;
                $sqlAvatar = !empty($avatar)? ", avatar =:avatar":"";
                $sql = "UPDATE users SET firstname = :firstname, surname =:surname, dateofbirth =:dateofbirth". $sqlAvatar ." WHERE user_id = :id";
            }
            else
            {
                $pwdData = $auth->hashPassword(trim($req->post('newpassword')), 'sha256');
                $pwdnew = $pwdData['pwdH'];
                $salt = $pwdData['salt'];
                $user = array(
                       'firstname' =>      trim($req->post('firstname')),
                       'surname' =>        trim($req->post('surname')),
                       'dateofbirth' =>    trim($req->post('dateofbirth')),
                       'password' =>       $pwdnew,
                       'salt' =>           $salt,
                       'id' =>             $id
                );
                if(!empty($avatar))
                    $user['avatar'] = $avatar;
                $sqlAvatar = !empty($avatar)? ", avatar =:avatar":"";
                $sql = "UPDATE users SET firstname = :firstname, surname =:surname, dateofbirth =:dateofbirth". $sqlAvatar ." , password=:password, passwordsalt=:salt WHERE user_id = :id";
            }
            UpdateDatabaseObject($sql,$user);
            $app->redirect('/code9000/account');
        }
        else
        {
			$_SESSION["loginmsg"] = "Your password was incorrect. Please enter the correct details.";
            $app->redirect('/code9000/account/edit');  
        }
     }
    else {
		$_SESSION["loginmsg"] = "Please login first.";
       $app->redirect('/code9000/login');    
    }
});

$app->get('/account/delete', function () use ($app) {
    if (isset($_SESSION['9K_USERID'])) {
        $id = $_SESSION['9K_USERID'];
        $app->render('account-delete.phtml');
    }
 else {
	$_SESSION["loginmsg"] = "Please login first before deleting your profile.";
    $app->redirect('/code9000/login');    
    }
});


$app->post('/account/delete', function () use ($app) {
    if (isset($_SESSION['9K_USERID'])) {
        $id = $_SESSION['9K_USERID'];
        $sql = "UPDATE users SET deleteddate = NOW() where user_id = :id";
        $var = array('id' => $id);
        $count = UpdateDatabaseObject($sql, $var);
        echo json_encode($count);
        
    }
 else {
	 $_SESSION["loginmsg"] = "Please login first before deleting your profile.";
    $app->redirect('/code9000/login');    
    }
});


/***********************
* SLIM FRAMEWORK
* RUN THE APP
***********************/

$app->run();
