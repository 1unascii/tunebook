
$(document).ready(function(){
    $('#tunes').dataTable();
    $('td').css("font: Times New Roman");
    //delete a tune from database
    $(".ui-icon-trash").on("click", function(){
        
        var result = confirm("Are you sure you want to delete this tune?");    
        if(result){
            $.post(
                "remove_tune.php",
                {
                    "tune_id":$(this).parent().prev().prev().prev().prev().prev().find("span").attr("id")
                },
                function(data){
                    if(data == "You don't have permission to delete this"){//should hopefully never happen
                        alert(data);                      
                    }else{
                        $("#content").load("tunes.php");
                    }
                }
            );         
        }
        
    });
    
    $('.tune_title').on("click", function(){
        var tune_id = $(this).attr('id');
        var tune_id_selector = "#" + tune_id; 
        //alert($(this).attr('id'));    
        $.post(
            "get_tune_body.php",
            {
                "tune_id": tune_id
            },
            function(data){
                if(data){
                    //var tune_body = tune.tune_body.string.replace('/\n/', "!");                    
                    var tune = jQuery.parseJSON(data);
                    if(!$(".tune_body").length){
                        
                        //display this tune body
                        $(tune_id_selector).html(
                            "<script src='js/abcjs_plugin_1.8-min.js' type='text/javascript'></script><script src='js/jquery.fullscreen-0.4.1.min.js' type='text/javascript'></script><script type='text/javascript'>ABCJS.plugin['hide_abc'] = true;</script>" + 
                            "<span class='tune_body' id='tune_body' style='white-space: pre;'>" +                            
                            "X:" + tune.tune_id + "<br />" +
                            "T:" + tune.tune_title + "<br />" +
                            "M:" + tune.metre + "<br />" +
                            "L:" + tune.default_note_length +  "<br />" +
                            "K:" + tune.key + "<br />" +
                            tune.tune_body + "<br /><br />" +
                            "</span>"                            
                        );
                        
                        //Close this tune body
                        $(tune_id_selector).after("<span class='ui-icon ui-icon-circle-close' style='display: inline-block;'></span><span class='ui-icon ui-icon-arrow-4-diag' style='display: inline-block;'></span>");
                        $(".ui-icon-circle-close").on("click", function(){
                            //var prev_id = $(this).prev().attr('id');
                           
                            $(tune_id_selector).html("<img src='images/notes.gif' alt='display sheet music'/>" + tune.tune_title);
                            
                            $('.tune_body').remove();
                            $('.abctext').remove();                         
                            $('.ui-icon-arrow-4-diag').remove();
                            $(this).remove();
                        })
                        
                        //Fullscreen
                        $('.ui-icon-arrow-4-diag').on("click", function(){
                            
                            if(!$.fullscreen.isFullScreen()){
                                //alert("hello world");
                                //$(tune_id_selector).css('background-color', "FFFFFF");
                                $(tune_id_selector).fullscreen(); 
                                $(tune_id_selector).on("dblclick", function(){
                                    if($.fullscreen.isFullScreen()){
                                        $.fullscreen.exit();
                                    }
                                })
                            } 
                            
                        });
                    }
                    
                    
                }
            }
        );      
    });
    
});
