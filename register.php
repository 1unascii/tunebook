<?php
    session_start(); 
    include_once('connect.php');
    include_once('functions.php');//Only because the form is loaded with AJAX
    if ($_POST['register']){        
        $params = array(
            'first_name' => $_POST['first_name'],
            'last_name' => $_POST['last_name'],
            'email' => $_POST['email'],
            'user_name' => $_POST['user_name'],
            'password' => sha1($_POST['password'])
            );   
        
        //insert NULL for auto increment ID, first name, last name, email, username, unhex(sha1(password))
        $query = "INSERT INTO users VALUES(
                NULL,
                :param0,
                :param1,
                :param2,
                :param3,
                UNHEX(:param4)
            );";
        
        if(insertQuery($query,  $params)){
            echo 'Thank you for signing up';
        }else{
            echo 'There were one or more errors with your submission';
        }
        
    }                
  
?>
