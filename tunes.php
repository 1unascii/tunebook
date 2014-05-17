<?php
    session_start();
    include_once('connect.php');
    //include_once('links.php');
    $query = "SELECT * FROM tunes";
    $tunes = simpleQuery($query);
    
?>

<script type="text/javascript" language="javascript" src="js/jquery.dataTables.js"></script>
<script type="text/javascript" language="javascript" src="js/tunes.js"></script>

<!--START A TABLE-->
<table id='tunes' >
    <thead class="ui-state-default">
        <th>Title</th>
        <th>Transcriber</th>
        <th>Composer</th>
        <th>Metre</th>        
        <th>Key</th>
        <?php
            if($_SESSION['Authenticated']){
                ?>
                    <th style="display:none;"></th>
                <?php
            }        
        ?>
    </thead>
    <tbody class="ui-state-default">
    
        <?php
        //print_r($tunes);
            //$count=0;
            foreach($tunes as $value){
                
                ?>
                    <tr class="tune_data">
                        <td>
                            <span class="tune_title" id=<?php echo $value['tune_id'] ?>>
                                <?php                                    
                                    echo $value['tune_title'];
                                ?>
                            </span>
                        </td>
                        <td >
                            <?php
                                $author_id = $value['author_id'];                               
                                $author = simpleQuery("SELECT user_name FROM users WHERE user_id = $author_id");
                                echo $author[0]['user_name'];
                            ?>
                        </td>
                        <td>
                        
                            <?php
                                $composer_id = $value['composer_id'];
                                $composer = simpleQuery("SELECT composer_name FROM composers WHERE composer_id = $composer_id");
                                echo $composer[0]['composer_name'];
                                
                            ?>
                        
                        </td>
                        <td>
                            <?php
                               echo $value['metre'];
                            ?>
                        </td>
                        <td>
                            <?php
                               echo $value['key'];
                            ?>
                        </td>
                        <?php 
                            if($_SESSION['Authenticated']){
                                ?>
                                <td>
                                    <?php
                                       if($_SESSION['author_id'] == $value['author_id']){
                                            ?>
                                            <span class="ui-icon ui-icon-trash" style="display: inline-block;"></span>
                                            <?php
                                        }
                                    ?>
                                </td>
                            <?php
                            }
                        ?>
                    </tr>
                    
                <?
            }
        ?>
   
    </tbody>
</table>
        

    
            
