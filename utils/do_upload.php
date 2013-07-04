<?php
/**
9K UPLOAD IMAGE
---------
# COPYRIGHT
(c) 2013, OKFN. All rights reserved.

# AUTHOR
Nico Verbruggen (nico.verb@gmail.com)
*/

echo(PATH_WEBROOT);

$allowedExts = array("gif", "jpeg", "jpg", "png");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);
if ((($_FILES["file"]["type"] == "image/gif")
|| ($_FILES["file"]["type"] == "image/jpeg")
|| ($_FILES["file"]["type"] == "image/jpg")
|| ($_FILES["file"]["type"] == "image/pjpeg")
|| ($_FILES["file"]["type"] == "image/x-png")
|| ($_FILES["file"]["type"] == "image/png"))
// && ($_FILES["file"]["size"] < 20000)
// && in_array($extension, $allowedExts))
)
  {
  if ($_FILES["file"]["error"] > 0)
    {
    echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
    }
  else
    {
    echo "Upload: " . $_FILES["file"]["name"] . "<br>";
    echo "Type: " . $_FILES["file"]["type"] . "<br>";
    echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
    echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";

    if (file_exists("C:\xampp\htdocs/Code9000/uploads/" . $_FILES["file"]["name"]))
      {
      echo $_FILES["file"]["name"] . " already exists. ";
      }
    else
      {
      move_uploaded_file($_FILES["file"]["tmp_name"],
      PATH_WEBROOT .DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . $_FILES["file"]["name"]);
      echo "Stored in: " . __DIR__ . "/uploads/" . $_FILES["file"]["name"];
      }
    }
  }
else
  {
  echo "Invalid file";
  }
?>
