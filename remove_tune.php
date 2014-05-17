<?php
    session_start();
    include_once('connect.php');
    $tune_id = $_POST['tune_id'];
    $query = "DELETE FROM tunes WHERE tune_id = $tune_id;";
    if(!deleteQuery($query)){
        echo "You don't have permission to delete this";
    }
    
    
?>
