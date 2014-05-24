<?php
    session_start();
    include_once('connect.php');
    $tune_types = simpleQuery('SELECT * FROM tune_types');
    $tune_type_ids = array();
    $tune_type_names = array();
    $query_array = array();
    $results_array = array();

    //extract the id and the name of each tune type
    $count = 0;
    foreach($tune_types as $value){
        $tune_type_ids[$count] = $value["tune_type_id"];
        $tune_type_names[$count] = $value["tune_type"];
        $count++;
    }    

    //construct an array to get all the tunes for each type, based on ID
    $count = 0;
    foreach($tune_type_ids as $value){
        $type_id = $tune_type_ids[$count];//int
        $query_array[$count] = "SELECT * FROM tunes WHERE tune_type_id = $type_id";
        $count++;
    }

    //run each query saving the results into an array
    $count = 0;
    foreach($query_array as $value){
        $results_array[$count] = simpleQuery($query_array[$count]);
        $count++;
    }
?>
<script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
<script type="text/javascript" language="javascript" src="js/jquery.dataTables.js"></script>
<script type="text/javascript" language="javascript" src="js/tunes.js"></script>
<script>
    $(function() {
         $( "#tabs" ).tabs();
     }); 
</script>
<link href="css/tunes.css" rel="stylesheet" type="text/css"/>
<!--START A TABLE-->

<div id="tabs">
    
<?php
    echo "<ul>";

    $count = 0;
    foreach($tune_type_names as $value){
        if($count > 0){
        echo   "<li><a href='#tabs-$count'>$tune_type_names[$count]s</a></li>";
        }else {
             echo   "<li><a href='#tabs-$count'>$tune_type_names[$count]</a></li>";
        }
        $count++;
    }
    echo "</ul>";

    $count = 0;
    foreach($results_array as $value){
        //i
        
       echo "<div id='tabs-$count'>";//the tab number

        $lowerCaseTuneType = mb_strtolower($tune_type_names[$count]);//lower case tune name
        echo "<table id=$lowerCaseTuneType>";//a table with an id of the tune name (lower case)
        echo "<thead class='ui-state-default'><th>Title</th><th>Transcriber</th><th>Composer</th><th>Key</th></thead>";//table headings
        //An extra header for the trash can icon to delete that user's tunes
        if($_SESSION['Authenticated']){
            echo "<th style='display:none;'></th>";
        } 
        echo "<tbody class='ui-state-default'>";
        
        foreach($value as $t){ //t for tune
        
        //Row
            echo "<tr class='tune_data'>";
                //Title
                $t_id = $t['tune_id'];
                $t_title = $t['tune_title'];
                echo "<td><span class='tune_title' id=$t_id >";
                    //Display Sheet Music button
                    echo "<img src='images/notes.gif' alt='display sheet music'/>";
                    echo "$t_title";
                echo "</span></td>";
                //Author
                echo "<td>";                
                    $author_id = $t['author_id'];                               
                    $author = simpleQuery("SELECT user_name FROM users WHERE user_id = $author_id");
                    echo $author[0]['user_name'];
                echo "</td>";
                //Composer
                echo "<td>";
                    $composer_id = $t['composer_id'];
                    $composer = simpleQuery("SELECT composer_name FROM composers WHERE composer_id = $composer_id");
                    echo $composer[0]['composer_name'];
                echo "</td>"; 
                //Key
                echo "<td>";
                    echo $t['key']; 
                echo "</td>";        
                if($_SESSION['Authenticated']){
                    echo "<td>";
                    if($_SESSION['author_id'] == $t['author_id']){       //Delete action
                        echo "<span class='ui-icon ui-icon-trash' style='display: inline-block;'></span>";
                    }
                    echo "</td>";
                }
            //End row
            echo "</tr>";            
        }    
        echo "</tbody></table></div>";
        $count++;
    }
?>


</div><!--Tabs div-->        

    
            