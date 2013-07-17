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
        include_once('/utils/connectiondb.php');
        include_once('/config/keys.php');
    }
    
    function register($data)
    {
        $fname = mysql_real_escape_string($data['fname']);
        $sname = mysql_real_escape_string($data['sname']);
        $email = mysql_real_escape_string($data['email']);
        $dob = mysql_real_escape_string($data['dob']);
        $admin = ( $data['admin']? "admin" : "user" );
        $passwordData = $this->hashPassword($data['pwd'], 'sha256');
        $activationcode = $this->generateRandomString(15);
        $avatar = $data['avatar'];
        
        //INSERT PROFILE PIC
        if (!empty($avatar)) {
            
            $vars = array('avatar'=> $avatar, 'firstname' => $fname, 'surname' => $sname, 'email' => $email, 'dateofbirth' => $dob, 'password' => $passwordData['pwdH'] ,'passwordsalt'=>$passwordData['salt'], 'role' => $admin, 'activationcode' => $activationcode );
        
            $sql =  "INSERT INTO users(email, password, passwordsalt, role, dateofbirth, firstname, surname, activationcode, avatar) " .
                    "values(:email , :password, :passwordsalt, :role, :dateofbirth, :firstname, :surname, :activationcode, :avatar)";
            
        }
        else
        {
            $vars = array('firstname' => $fname, 'surname' => $sname, 'email' => $email, 'dateofbirth' => $dob, 'password' => $passwordData['pwdH'] ,'passwordsalt'=>$passwordData['salt'], 'role' => $admin, 'activationcode' => $activationcode );
        
            $sql =  "INSERT INTO users(email, password, passwordsalt, role, dateofbirth, firstname, surname, activationcode) " .
                    "values(:email , :password, :passwordsalt, :role, :dateofbirth, :firstname, :surname, :activationcode)";
        }
                
        $id = InsertDatabaseObject($sql, $vars);
                
        $this->sendRegistrationMail($email, $activationcode, $fname . " " . $sname);        
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
    
    function sendRegistrationMail($email, $code,  $name)
    {
        $mail = new PHPMailer();
        $mail->IsSMTP();                                      // Set mailer to use SMTP
        $mail->Mailer = "smtp";
        $mail->Host = 'ssl://smtp.gmail.com';  // Specify main and backup server
        $mail->Port = "465";
        $mail->SMTPAuth = true;                               // Enable SMTP authentication
        $mail->Username = '9KBuilder@gmail.com';                            // SMTP username
        $mail->Password = EMAIL_PWD;  
        $mail->SMTPDebug = 1;
        $mail->From = '9KBuilder@gmail.com';
        $mail->FromName = "9KBuilder";
        $mail->AddAddress($email, $name);  // Add a recipient
        $mail->IsHTML(true);                                  // Set email format to HTML

        $mail->Subject = 'Activation code';
        $mail->Body    = 'Welcome at 9KBuilder. <a href="localhost:8888/Code9000/activateaccount/' . $code . '/'.$email.'">Activate now</a> or go to localhost:8888/Code9000/activateaccount/' . $code . '/'.$email.' to activate your account';
                
        if(!$mail->Send()) {
           echo 'Message could not be sent.';
           echo 'Mailer Error: ' . $mail->ErrorInfo;
           exit;
        }
    }
    
    function activateAccount($email, $code)
    {
        $sqlcheck = "SELECT * From users where email = :email;";
        $varscheck = array('email' => $email);
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
                $sql = "UPDATE users SET activationdate = NOW() where email = :email AND activationcode = :code";
                $vars = array('email' =>$email, 'code' => $code);
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