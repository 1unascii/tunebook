<?php
    session_start();
    include_once('connect.php');
    $tune_id = $_POST['tune_id'];
    $query = "SELECT * FROM tunes WHERE tune_id = :param;";
    $tune = queryWithParams($query, $tune_id);    
    echo json_encode($tune);
?>
