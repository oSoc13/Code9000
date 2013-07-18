9K Project
=========

# Deployment instructions

## Requirements

* PHP 5.4+
* MySQL
* Composer

## The short version

In short, here's what you need to do in order to deploy the project.

1. Place the Code9000 dir onto the server root.
2. Create an /uploads folder in the Code9000 directory
3. Deploy an empty database from /docs/Database into the MySQL server
4. Install all required vendor packages using Composer
5. Set up the configuration files (templates can be found in /utils)
	* Get *connectiondetails.php* and enter the correct server + database details
	* Get *Authentication.php* and configure the email setup
	* Get *keys.php* and set the email password and global salt
6. Run the servers and navigate to www.yourdomain.com/Code9000
7. Set up referrals to refer www.yourdomain.com/ to www.yourdomain.com/Code9000

## The long version

### Step 1: Moving the root folder to your web server

You can copy the contents of the **Code9000** directory to the root of your server, but this will break all links in /templates. (We need absolute links to ensure that our Slim templates are linked to stylesheets and scripts.)

This is why we **recommend placing the folder in its entirety onto the root of your server**. That means that in an optimal setup, your folder structure will look something like this:

- /
- /Code9000

If you do want to move the contents of the Code9000 project to the root of your server, please adjust the index.php file and .htaccess to point to "/" instead of "/Code9000". Also, in the /templates folder, you have to ensure that all links point to /Code9000. Some other scripts and PHP might refer to this /Code9000 folder, so please DO NOT DO THIS UNLESS ABSOLUTELY NECESSARY.

### Step 2: Set up your domain to redirect

This is unique to each hosting and web server management, but make it so that the root of your domain refers to /Code9000.

e.g. code9000.gent.be will automatically take you to code9000.gent.be/Code9000

### Step 3: Deploy an empty database

First, you will have to create a new database with a name you prefer. We use "Code9000" as the name of our database, but you can decide on your own name by referring to it in the configuration files. More about that later.

### Step 4: Install all vendor files using Composer

For more instructions on how to use Composer, visit http://getcomposer.org/.

### Step 5: Set up the configuration files

#### connectiondetails.php

Find /utils/connectiondetails_sample.php and rename the file to connectiondetails.php. Also, move the file to /config/.

Replace the data with the relevant information. Here's the file.

`<?php`
`define('DB_HOST', '127.0.0.1'); // Your server host for the database`
`define('DB_USER', 'root'); // Your username to authenticate with the DB`
`define('DB_PASSWORD', ''); // Your password to authenticate with the DB`
`define("DB_NAME", "9kbuilder"); // Enter the name of your database here`

#### keys.php

Find /utils/keys_sample.php and rename the file to keys.php. Also, move the file to /config/.

Fill in the missing information. Please note that the email address is chosen in Authentication.php, which we'll cover below.

`define('EMAIL_PWD', ""); // Password for email address`
`define('GLOBAL_SALT', ""); // Global salt`

#### Authentication.php

Find Authentication.php in the /config folder. You can copy it over to /config and change the email parameters if you want to. The relevant email parameters will look something like this.

<pre>
function sendRegistrationMail($email, $code,  $name)
    {
        $mail = new PHPMailer();
        $mail->IsSMTP();                                    // Set mailer to use SMTP
        $mail->Mailer = "smtp";								// Use SMTP
        $mail->Host = 'ssl://smtp.gmail.com';				// Specify main and backup server
        $mail->Port = "465";								// Port
        $mail->SMTPAuth = true;                             // Enable SMTP authentication
        $mail->Username = '9KBuilder@gmail.com';            // SMTP username
        $mail->Password = EMAIL_PWD;  						// Password from /config/keys.php
        $mail->SMTPDebug = 1;								// SMTP Debug on or not
        $mail->From = '9KBuilder@gmail.com';				// Sender email address
        $mail->FromName = "9KBuilder";						// Who sent the message?
        $mail->AddAddress($email, $name);					// Add a recipient
        $mail->IsHTML(true);                                // Set email format to HTML

        $mail->Subject = '9K Spotter Activation';
        $mail->Body    = 'Enter your html here';
	}
</pre>
        
#### Set up an admin account

Create a new account by going through the sign up process, and then navigate to your SQL Server. You might want to give yourself administrator privileges by navigating to the 'users' table and assigning 'admin' to your role.

You can do this using PhpMyAdmin by setting "role" to "admin" for the user that you want to give administrator privileges. There is currently no front-end way to give someone administrator privileges.