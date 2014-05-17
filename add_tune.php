<?php
session_start();
include_once('connect.php');
    $tune_type = $_POST['tune_type'];
    $query = "SELECT tune_type_id FROM tune_types WHERE tune_type = '$tune_type';" ;
    $tune_type_id = simpleQuery($query);
    $composer = $_POST['composer'];
    $query = "SELECT composer_id FROM composers WHERE composer_name = '$composer';";
    $composer_id = simpleQuery($query);
    
    $params = array(
        'tune_title' => $_POST['tune_title'],
        'tune_type' => $tune_type_id,
        'author_id' => $_SESSION['author_id'],
        'composer_id' => $composer_id,
        'metre' => $_POST['metre'],
        'default_note_length' => $_POST['default_note_length'],
        'tune_key' => $_POST['tune_key'],
        'tune_body' => $_POST['tune_body'],
        'audio' => 'None',
        'video' => 'None'            
        ); 
    
    $query = "INSERT INTO tunes VALUES(
            NULL,
            :param0,
            :param1,
            :param2,
            :param3,
            :param4,
            :param5,
            :param6,
            :param7,
            :param8,
            :param9
        );";
    
    if(insertQuery($query,  $params)){
        echo 'Thank you. Your tune was submitted';
    }else{
        echo 'There was an error with your tune submission';
    }
    
    
    
    

   
  
?>
