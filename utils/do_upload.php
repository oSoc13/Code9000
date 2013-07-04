<?php
/**
9K UPLOAD IMAGE
---------
# COPYRIGHT
(c) 2013, OKFN. All rights reserved.

# AUTHOR
Nico Verbruggen (nico.verb@gmail.com)
Stefaan Christiaens (stefaan.ch@gmail.com)
*/

// Include required for ensuring uploads end up in the correct folder!
include_once('../routes.php');

require PATH_WEBROOT . DIRECTORY_SEPARATOR . 'vendor/autoload.php';

// import the Intervention Image Class
use \Intervention\Image\Image;

 
$allowedExts = array("gif", "jpeg", "jpg", "png");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);
if ((
        ($_FILES["file"]["type"] == "image/gif")
        || ($_FILES["file"]["type"] == "image/jpeg")
        || ($_FILES["file"]["type"] == "image/jpg")
        || ($_FILES["file"]["type"] == "image/pjpeg")
        || ($_FILES["file"]["type"] == "image/x-png")
        || ($_FILES["file"]["type"] == "image/png")
    )
        && ($_FILES["file"]["size"] < 9999999999999999)
        && in_array($extension, $allowedExts))
{
    if ($_FILES["file"]["error"] > 0)
    {
        //echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
    }
    else
    {
                    
        $milliseconds = round(microtime(true) * 1000);
        $name = $_FILES["file"]["name"] . $milliseconds;
        $finalName = base64_encode($name) . "." . $extension;


        $img = Image::make($_FILES["file"]["tmp_name"]);
        $img->resize(300, null, true)->encode('png', 20);
        $img->save(PATH_WEBROOT . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . $finalName);
        
        //var_dump(PATH_WEBROOT);
        header("Location: " . DIRECTORY_SEPARATOR . BASE_URL_9K  );
    }
}
else
{
    echo "Invalid file";
}

