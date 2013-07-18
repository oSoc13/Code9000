<?php

/**
9K AUTH system
---------
# COPYRIGHT
(c) 2013, OKFN Belgium. Some rights reserved.

# AUTHOR
Stefaan Christiaens (stefaan.ch@gmail.com)
*/


class Authentication {
    
    function __construct()
    {
        include_once('utils/connectiondb.php');
        include_once('config/keys.php');
    }
    
    function register($data)
    {
        $fname = $data['fname'];
        $sname = $data['sname'];
        $email = $data['email'];
        $dob = $data['dob'];
        $passwordData = $this->hashPassword($data['pwd'], 'sha256');
        $activationcode = $this->generateRandomString(15);
        $avatar = $data['avatar'];
        
        //INSERT PROFILE PIC
        if (!empty($avatar)) {
            
            $vars = array('avatar'=> $avatar, 'firstname' => $fname, 'surname' => $sname, 'email' => $email, 'dateofbirth' => $dob, 'password' => $passwordData['pwdH'] ,'passwordsalt'=>$passwordData['salt'], 'role' => 'user', 'activationcode' => $activationcode );
        
            $sql =  "INSERT INTO users(email, password, passwordsalt, role, dateofbirth, firstname, surname, activationcode, avatar) " .
                    "values(:email , :password, :passwordsalt, :role, :dateofbirth, :firstname, :surname, :activationcode, :avatar)";
            
        }
        else
        {
            $vars = array('firstname' => $fname, 'surname' => $sname, 'email' => $email, 'dateofbirth' => $dob, 'password' => $passwordData['pwdH'] ,'passwordsalt'=>$passwordData['salt'], 'role' => 'user', 'activationcode' => $activationcode );
        
            $sql =  "INSERT INTO users(email, password, passwordsalt, role, dateofbirth, firstname, surname, activationcode) " .
                    "values(:email , :password, :passwordsalt, :role, :dateofbirth, :firstname, :surname, :activationcode)";
        }
                
        $id = InsertDatabaseObject($sql, $vars);
                
        $this->sendRegistrationMail($id, $activationcode, $fname . " " . $sname);        
    }
    
    function hashPassword($pwd, $algo)
    {
        $salt = $this->generateSalt();
        $pwdH = hash($algo, GLOBAL_SALT . $pwd . $salt);
        return array('salt' => $salt, 'pwdH' => $pwdH);
    }
    
    function generateSalt()
    {
        return base64_encode($this->generateRandomString(64));
    }
    
    function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $randomString;
    }
    
    function sendRegistrationMail($id, $code,  $name)
    {
        $mail = new PHPMailer();
        $mail->IsSMTP();                                    // Set mailer to use SMTP
        $mail->Mailer = "smtp";
        $mail->Host = 'ssl://smtp.gmail.com';				// Specify main and backup server
        $mail->Port = "465";
        $mail->SMTPAuth = true;                             // Enable SMTP authentication
        $mail->Username = '9KBuilder@gmail.com';            // SMTP username
        $mail->Password = EMAIL_PWD;  
        $mail->SMTPDebug = 1;
        $mail->From = '9KBuilder@gmail.com';
        $mail->FromName = "9KBuilder";
        $mail->AddAddress($email, $name);					// Add a recipient
        $mail->IsHTML(true);                                // Set email format to HTML

        $mail->Subject = '9K Spotter Activation';
        $mail->Body    = '<h3>Hi there, and welcome to 9K Spotter!</h3>
<p>You just registered a new account. Please activate your account before you can use the application. Thanks.</p>
<p><a href="http://code9000.gent.be/Code9000/activateaccount/' . $code . '/'.$id.'">Please activate your account by clicking this link</a>.</p>';
                
        if(!$mail->Send()) {
           echo 'Message could not be sent.';
           echo 'Mailer Error: ' . $mail->ErrorInfo;
           exit;
        }
    }
    
    function activateAccount($id, $code)
    {
        $sqlcheck = "SELECT * From users where user_id = :id;";
        $varscheck = array('id' => $id);
        $output = GetFirstDatabaseObject($sqlcheck, $varscheck);
        
        if (empty($output)) {
            throw new Exception('No user was found with the provided credentials');
        }
        else
        {
            if (!empty($output['activationdate'])) {
                throw new Exception('User was already activated.');
            }
            else
            {
                $sql = "UPDATE users SET activationdate = NOW() where user_id = :id AND activationcode = :code";
                $vars = array('id' =>$id, 'code' => $code);
                return UpdateDatabaseObject($sql,$vars);
            }
        }
    }
    
    function login($email, $password)
    {
        $sql = "Select user_id, password, passwordsalt, activationdate, deleteddate, role from users where email = :email";
        $vars = array('email' =>$email);
        
        $passwordArray = GetFirstDatabaseObject($sql,$vars);
        if (empty($passwordArray) || !empty($passwordArray['deleteddate'])) 
        {
            return 'NO_USER';
        }
        else
        {
            $pwdH = hash('sha256', GLOBAL_SALT . $password . $passwordArray['passwordsalt']);

            if ($pwdH == $passwordArray['password']) 
            {
                if (!empty($passwordArray['activationdate'])) 
                {
                    $sql = "UPDATE users SET lastloggedindate = NOW() where user_id = :id";
                    $vars = array('id' => $passwordArray['user_id']);
                    $count = UpdateDatabaseObject($sql,$vars);
                    
                    $_SESSION['9K_USER'] = $email;
                    $_SESSION['9K_USERID'] = $passwordArray['user_id'];
                    $_SESSION['9K_ROLE'] = $passwordArray['role'];
                    return "OK";
                }
                else
                {
                    return "ACT";
                }
            }
            else
            {
                return "PWD";
            }
        }
    }
    
    function checkPassword($pwd, $salt, $test)
    {
        $pwdH = hash('sha256', GLOBAL_SALT . $test . $salt);

        return ($pwdH == $pwd? true:false); 
    }
}