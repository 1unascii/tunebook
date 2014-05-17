<script type="text/javascript" src="js/links.js"></script>
<div id='add_tune_link'>New Tune</div>
<?php
    //IF LOGGED IN
    if($_SESSION['Authenticated'] == 1){ 
?>      
        <div id='logout_link'>Log Out</div>
<?php        
    //IF NOT LOGGED IN      
    }else{    
?>
        <div id='login_link'>Log In</div>
        <div id='register_link'>Register</div>
<?php        
    }
?>

