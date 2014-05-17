$(document).ready(function(){
        
    if($('#login_link').length){
        $('#login_link').click(function(){
            $('#content').load('forms/login.php');
        }).on('mouseover', function(){
            $(this).css('color', 'red');
        }).on('mouseout', function(){
            $(this).css('color', 'black');
        });
    }
    if($('#register_link').length){
        $('#register_link').click(function(){
            $('#content').load('forms/registration.php');
        }).on('mouseover', function(){
            $(this).css('color', 'red');
        }).on('mouseout', function(){
            $(this).css('color', 'black');
        });
    }
    if($('#add_tune_link').length){
        $('#add_tune_link').click(function(){
            $('#content').load('forms/abc_editor.php');
        }).on('mouseover', function(){
            $(this).css('color', 'red');
        }).on('mouseout', function(){
            $(this).css('color', 'black');
        });
    }
    if($('#logout_link').length){
        $('#logout_link').click(function(){
            $.get(
              "auth.php",
              {
                "logout":true
              },
              function(data){
                alert(data);
                window.location.href ="index.php";
              }
          );
        //$(document).load('index.php');
        }).on('mouseover', function(){
            $(this).css('color', 'red');
        }).on('mouseout', function(){
            $(this).css('color', 'black');
        });
    }
})
    
