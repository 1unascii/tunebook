$(document).ready(function(){
    var selection = '';//for playing selections
    //var available_notes = new Array("C,", "D,", "E,", "F,", "G,", "A,", "B,", "C", "D", "E", "F", "G", "A", "B", "c", "d", "e", "f", "g", "a", "b", "c'", "d'", "e'", "f'", "g'", "a'", "b'");
    var sharps = new Array("F", "f");
    var flats = new Array("B", "b"); 
    var fourCharsAgo = '';   
    var threeCharsAgo = '';
    var charBeforeLast = '';
    var lastChar = '';
    var nextChar = '';
    var charAfterNext = '';
    var threeCharsAhead = '';
    var letters = /^[a-zA-Z]+$/;
    var key = $('#key').val();//what key are we in?
    
    function GetCaretPosition(ctrl) {
        var CaretPos = 0;   // IE Support
        if (document.selection) {
            ctrl.focus();
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -ctrl.value.length);
            CaretPos = Sel.text.length;
        }
        // Firefox support
        else if (ctrl.selectionStart || ctrl.selectionStart == '0')
            CaretPos = ctrl.selectionStart;
        return (CaretPos);
    }

    function returnChar(selector, caretStart, caretEnd ) {
        //var index = text.indexOf(caretPos);
        return selector.substring(caretStart, caretEnd);        
    }
    
       
    function findSurroundingChars() {
        var selector = document.getElementById("abc");
        var caretPos = GetCaretPosition(selector);
        sevenCharsAgo = returnChar(selector.value, caretPos -6, caretPos -5);//seven chars back
        sixCharsAgo = returnChar(selector.value, caretPos -6, caretPos -5);//six chars back
        fiveCharsAgo = returnChar(selector.value, caretPos -5, caretPos -4);//five chars back
        fourCharsAgo = returnChar(selector.value, caretPos -4, caretPos -3);//four chars back
        threeCharsAgo = returnChar(selector.value, caretPos -3, caretPos -2);//three chars back
        charBeforeLast = returnChar(selector.value, caretPos -2, caretPos -1);//two chars back
        lastChar = returnChar(selector.value, caretPos -1, caretPos);//last char
        nextChar = returnChar(selector.value, caretPos, caretPos +1);//next char
        charAfterNext = returnChar(selector.value, caretPos +1, caretPos +2);//next char
        threeCharsAhead = returnChar(selector.value, caretPos +2, caretPos +3);//three chars ahead
    }
    
    //octave is a boolean
    function accidentalNotes(accidentals, modifierString, keyPress, octave){
        var accidental = false;
        for(var i=0; i<accidentals.length; i++){
            if(accidentals[i] == keyPress){//keyPress
                accidental = true;
            }
        }
        if(accidental){   
            if(octave){
                return (modifierString + lastChar + keyPress);
            }else{
                return (modifierString + keyPress);
            }                                              
        }else{ 
            if(octave){
                return (lastChar + keyPress);
            }else{
                return (keyPress); 
            }                                                       
        }        
    }
    
   

    $('#abc').on("click", function(){
        findSurroundingChars();
    })
    

    //play the notes as they are pressed
    //function keyPress();
    $('#abc').on('keypress', function(event){
        


        findSurroundingChars();
        key = $('#key').val();        
        var c = event.which;//character code        
        var keyPress = String.fromCharCode(c);//convert it to a string
        var play;
        if(keyPress == '^' || keyPress == '_' || keyPress == '='){
            //Double Accidental with octave modifier
            if(nextChar == keyPress && threeCharsAhead == ',' || threeCharsAhead == '\''){
                $(this).play(keyPress + nextChar + charAfterNext + threeCharsAhead);
            //Double Accidental without octave modifier
            }else if(nextChar == keyPress){
                $(this).play(keyPress + nextChar + charAfterNext);
            //An accidental sandwiched between and accidental and a note with octave modifier
            }else if (lastChar == '^' || lastChar == '_' && nextChar.match(letters) && charAfterNext  == ',' || charAfterNext == '\''){
                $(this).play(lastChar + keyPress + nextChar + charAfterNext)
            //accidental was sandwiched between accidental and a note
            }else if(lastChar == '^' || lastChar == '_' && nextChar.match(letters)){
                $(this).play(lastChar + keyPress + nextChar)
            //Accidental added before a letter with octave modifier
            }else if(nextChar.match(letters) && charAfterNext == ',' || charAfterNext =='\''){
                $(this).play(keyPress + nextChar + charAfterNext);
            // "" ""  without octave modifier
            }else if(nextChar.match(letters)){
                $(this).play(keyPress + nextChar);
            }
        }else
        if(lastChar == '^' || lastChar == '_'){
            if(charBeforeLast == lastChar){                
                $(this).play(charBeforeLast + lastChar + keyPress);//double accidental                
            }else{                
                $(this).play(lastChar + keyPress);//accidental note 
            }
        }else        
        if(keyPress == ',' || keyPress =='\''){  
            sharps = [];
            sharps.push("F", "f");
            flats = [];
            flats.push("B", "b");
            if(charBeforeLast == '^' || charBeforeLast == '_' || charBeforeLast == '='){//if the user modified the note
                
                if(threeCharsAgo == charBeforeLast){//just how modified is this note anyway?
                    if(nextChar == ',' || nextChar == '\''){
                        $(this).play(threeCharsAgo + charBeforeLast + lastChar + keyPress + nextChar);  
                    } else {
                        $(this).play(threeCharsAgo + charBeforeLast + lastChar + keyPress);                    
                    }                    
                }else{//ok it's only a single accidental
                    $(this).play(charBeforeLast + lastChar + keyPress);
                } 
                
            }else if(lastChar == ',' || lastChar == '\'') { 
                
                //test backwards for accidentals 
                if(sixCharsAgo == '^' || sixCharsAgo == '_' || sixCharsAgo == '='){
                    //test back further to see if it is a double accidental
                    if(sevenCharsAgo == sixCharsAgo) {
                        //play using the double accidental
                        $(this).play(sevenCharsAgo + sixCharsAgo + fiveCharsAgo + fourCharsAgo + threeCharsAgo + charBeforeLast + lastChar + keyPress);
                    }else{
                        //use only the single accidental modifier
                        $(this).play(sixCharsAgo + fiveCharsAgo + fourCharsAgo + threeCharsAgo + charBeforeLast + lastChar + keyPress);
                    }
                }else 
                if(fiveCharsAgo == '^' || fiveCharsAgo == '_' || fiveCharsAgo == '='){                    
                    if(sixCharsAgo == fiveCharsAgo) {                       
                        $(this).play(sixCharsAgo + fiveCharsAgo + fourCharsAgo + threeCharsAgo + charBeforeLast + lastChar + keyPress);
                    }else{                        
                        $(this).play(fiveCharsAgo + fourCharsAgo + threeCharsAgo + charBeforeLast + lastChar + keyPress);
                    }
                }else if(fourCharsAgo == '^' || fourCharsAgo == '_' || fourCharsAgo == '='){
                    if(fiveCharsAgo == fourCharsAgo){                    
                        $(this).play(fiveCharsAgo + fourCharsAgo + threeCharsAgo + charBeforeLast + lastChar + keyPress);
                    }else{
                        $(this).play(fourCharsAgo + threeCharsAgo + charBeforeLast + lastChar + keyPress);
                    }               
                }else if(threeCharsAgo == '^' || threeCharsAgo == '_' || threeCharsAgo == '=') {
                    if(fourCharsAgo == threeCharsAgo){                    
                        $(this).play(fourCharsAgo + threeCharsAgo + charBeforeLast + lastChar + keyPress);    
                    }else{
                        $(this).play(threeCharsAgo + charBeforeLast + lastChar + keyPress);
                    }             
                }else
                //allow for no accidentals with multiple octave modifiers
                if(fiveCharsAgo == ',' || fiveCharsAgo == '\''){
                    $(this).play(sixCharsAgo + fiveCharsAgo + fourCharsAgo + threeCharsAgo + charBeforeLast + lastChar + keyPress);
                }else
                if(fourCharsAgo == ',' || fourCharsAgo == '\''){
                    $(this).play(fiveCharsAgo + fourCharsAgo + threeCharsAgo + charBeforeLast + lastChar + keyPress);
                }else
                if(threeCharsAgo == ',' || threeCharsAgo == '\''){
                    $(this).play(fourCharsAgo + threeCharsAgo + charBeforeLast + lastChar + keyPress);
                }else
                if(charBeforeLast == ',' || charBeforeLast == '\''){
                    $(this).play(threeCharsAgo + charBeforeLast + lastChar + keyPress);
                }else{
                    $(this).play(charBeforeLast + lastChar + keyPress);
                }   

                
            }else { 
                
                if(key == "C" || key == "D dorian" || key == "G Mixolydian" || key == "A minor"){    
                    $(this).play(lastChar + keyPress); 
                }else
                //Sharp keys
                if(key == "G" || key == "A dorian" || key == "D Mixolydian" || key == "E minor"){
                    $(this).play(accidentalNotes(sharps, '^', keyPress, true));
                }else{
                    sharps.push("C", "c"); 
                } 
                if(key == "D" || key == "E dorian" || key == "A Mixolydian" || key == "B minor"){                               
                }else{
                    sharps.push("G", "g");    
                } 
                if(key == "A" || key == "B dorian" || key == "E Mixolydian" || key == "F# minor"){                            
                    $(this).play(accidentalNotes(sharps, '^', keyPress, true));                
                }else{
                    sharps.push("D", "d"); 
                } 
                if(key == "E" || key == "F# dorian" || key == "B Mixolydian" || key == "C# minor"){                               
                    $(this).play(accidentalNotes(sharps, '^', keyPress, true));                
                }else{
                    sharps.push("A", "a");  
                } 
                if(key == "B" || key == "C# dorian" || key == "F# Mixolydian" || key == "G# minor"){                                
                    $(this).play(accidentalNotes(sharps, '^', keyPress, true));                
                }else{
                    sharps.push("E", "e");
                }
                if(key == "F#" || key == "G# dorian" || key == "C# Mixolydian" || key == "D# minor"){                                
                    $(this).play(accidentalNotes(sharps, '^', keyPress, true));                
                }else{
                    sharps.push("B", "b"); 
                } 
                if(key == "C#" || key == "D# dorian" || key == "G# Mixolydian" || key == "A# minor"){                               
                    $(this).play(accidentalNotes(sharps, '^', keyPress, true));
                //Flat keys                
                }else if(key == "F" || key == "G dorian" || key == "C Mixolydian" || key == "D minor"){
                    $(this).play(accidentalNotes(flats, '_', keyPress, true));
                }else{
                    flats.push("E", "e");
                }
                if(key == "Bb" || key == "C dorian" || key == "F Mixolydian" || key == "G minor"){
                    $(this).play(accidentalNotes(flats, '_', keyPress, true));
                }else{
                    flats.push("A", "a");
                }
                if(key == "Eb" || key == "F dorian" || key == "Bb Mixolydian" || key == "C minor"){
                    $(this).play(accidentalNotes(flats, '_', keyPress, true));
                }else{
                    flats.push("D", "d");
                }
                if(key == "Ab" || key == "Bb dorian" || key == "Eb Mixolydian" || key == "F minor"){
                    $(this).play(accidentalNotes(flats, '_', keyPress, true));
                }else{
                    flats.push("G", "g");
                }
                if(key == "Db" || key == "Eb dorian" || key == "Ab Mixolydian" || key == "Bb minor"){
                    $(this).play(accidentalNotes(flats, '_', keyPress, true));
                }else{
                    flats.push("C", "c");
                }
                if(key == "Gb" || key == "Ab dorian" || key == "Db Mixolydian" || key == "Eb minor"){
                    $(this).play(accidentalNotes(flats, '_', keyPress, true));
                }else{
                    flats.push("F", "f");
                }
                if(key == "Cb" || key == "Db dorian" || key == "Gb Mixolydian" || key == "Ab minor"){
                    $(this).play(accidentalNotes(flats, '_', keyPress, true));
                }
            }
        }else{//if keypress was not a modifier AND last key press also was not a modifier
            //then just play the keyed note value, modified by key, of course
            sharps = [];
            sharps.push("F", "f");
            
            flats = [];
            flats.push("B", "b");
            if(key == "C" || key == "D dorian" || key == "G Mixolydian" || key == "A minor"){                
                $(this).play(keyPress);//just send the current key press.
            }else
            if(key == "G" || key == "A dorian" || key == "D Mixolydian" || key == "E minor"){
                $(this).play(accidentalNotes(sharps, '^', keyPress));
            }else{
                sharps.push("C", "c"); 
            } 
            if(key == "D" || key == "E dorian" || key == "A Mixolydian" || key == "B minor"){                               
                $(this).play(accidentalNotes(sharps, '^', keyPress));
            }else{
                sharps.push("G", "g");    
            } 
            if(key == "A" || key == "B dorian" || key == "E Mixolydian" || key == "F# minor"){                            
                $(this).play(accidentalNotes(sharps, '^', keyPress));                
            }else{
                sharps.push("D", "d"); 
            } 
            if(key == "E" || key == "F# dorian" || key == "B Mixolydian" || key == "C# minor"){                               
                $(this).play(accidentalNotes(sharps, '^', keyPress));                
            }else{
                sharps.push("A", "a");  
            } 
            if(key == "B" || key == "C# dorian" || key == "F# Mixolydian" || key == "G# minor"){                                
                $(this).play(accidentalNotes(sharps, '^', keyPress));                
            }else{
                sharps.push("E", "e");
            }
            if(key == "F#" || key == "G# dorian" || key == "C# Mixolydian" || key == "D# minor"){                                
                $(this).play(accidentalNotes(sharps, '^', keyPress));                
            }else{
                sharps.push("B", "b"); 
            } 
            if(key == "C#" || key == "D# dorian" || key == "G# Mixolydian" || key == "A# minor"){                               
                $(this).play(accidentalNotes(sharps, '^', keyPress));
            //Flat keys                
            }else if(key == "F" || key == "G dorian" || key == "C Mixolydian" || key == "D minor"){
                $(this).play(accidentalNotes(flats, '_', keyPress));
            }else{
                flats.push("E", "e");
            }
            if(key == "Bb" || key == "C dorian" || key == "F Mixolydian" || key == "G minor"){
                $(this).play(accidentalNotes(flats, '_', keyPress));
            }else{
                flats.push("A", "a");
            }
            if(key == "Eb" || key == "F dorian" || key == "Bb Mixolydian" || key == "C minor"){
                $(this).play(accidentalNotes(flats, '_', keyPress));
            }else{
                flats.push("D", "d");
            }
            if(key == "Ab" || key == "Bb dorian" || key == "Eb Mixolydian" || key == "F minor"){
                $(this).play(accidentalNotes(flats, '_', keyPress));
            }else{
                flats.push("G", "g");
            }
            if(key == "Db" || key == "Eb dorian" || key == "Ab Mixolydian" || key == "Bb minor"){
                $(this).play(accidentalNotes(flats, '_', keyPress));
            }else{
                flats.push("C", "c");
            }
            if(key == "Gb" || key == "Ab dorian" || key == "Db Mixolydian" || key == "Eb minor"){
                $(this).play(accidentalNotes(flats, '_', keyPress));
            }else{
                flats.push("F", "f");
            }
            if(key == "Cb" || key == "Db dorian" || key == "Gb Mixolydian" || key == "Ab minor"){
                $(this).play(accidentalNotes(flats, '_', keyPress));
            }
        }

    });
    
    function getSelectionText() {
    
        var text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
        if(text !== ""){
            return text;
        }else{
            return false;
        }
    }
    
    /*                            
    This function uses the jQuery Turtle plugin. This is a plugin designed for writing basic games
    This function uses the "play" method to play notes. The play method uses abc notation but it doesn't account for keys.
    Also because we are doing dynamic playback as the user enters characters of abc code into the textbox
    We have to calculate any octave modifications as well as flat notes, sharp notes, double flats and sharps, and the combinations
    of those accidentals or double accidentals with or without octave modifiers
    */
    function playBack(key, keys, accidentals, splitArray, modifier){
        var new_abc = '';
        if(key == keys[0] || key == keys[1] || key == keys[2] || key == keys[3]){            
            for(var i=0; i<splitArray.length; i++){
                for(var c=0; c<accidentals.length; c++){
                    if(accidentals[c] == splitArray[i] && splitArray[i-1] !== '^' && splitArray[i-1] !== '_' && splitArray[i-1] !== '='){
                        splitArray[i] = modifier + splitArray[i];
                    }
                }
                if(splitArray[i] == '3' && splitArray[i-1] == '(' ){                    
                    var count = 0;
                    var count2 = 1;
                    while(count<2){
                        if(splitArray[i + count2] !== ' ' && splitArray[i + count2] !== '^' && splitArray[i + count2] !== '_' && splitArray[i + count2] !== '=' && splitArray[i + count2] !== ',' && splitArray[i + count2] !== '\'' && splitArray[i + count2] !== '/' && splitArray[i + count2]!== '\'/' && splitArray[i + count2] !== ',/'){                            
                            for(var c=0; c<accidentals.length; c++){
                                if(accidentals[c] == splitArray[i + count2]){
                                    splitArray[i + count2] = modifier + splitArray[i + count2]; 
                                }
                            }
                            if(splitArray[i + count2 + 1] == ',' || splitArray[i + count2 + 1] == '\''){
                                splitArray[i + count2 + 1] = splitArray[i + count2 + 1] + '/';
                            }else{
                                splitArray[i + count2] = splitArray[i + count2] + '/';
                            }                         
                            count++;
                        }
                        count2++;
                    }
                }
                new_abc += splitArray[i];
            }             
            $('#abc').play(new_abc);//jQuery Turtle plugin
            //alert(new_abc);
            $('#play').fadeOut(250);
            return true;
        }
        else{
            return false;
        }
    }
    $('#abc').on('select keyup', function(){
        
        key = $('#key').val();    
        selection = getSelectionText();
        //$('#abc').selection();
        //selection = $('#abc').selection();
        if(selection){
            $('#play_selection').html("<input type='button' id='play' value='Play Selection'/>"); 
        }
        $('#play').on("click", function(){ 
            if(selection){
                
                sharps = new Array("F", "f");                
                flats = new Array("B", "b");
                key = $('#key').val();
                var abc_split = selection.split('');
                playBack(key, ["C","D dorian","GMixolydian", "A minor"], [], abc_split, '');
                if(!(playBack(key, ["G","A dorian","D Mixolydian", "E minor"], sharps, abc_split, '^'))){
                    sharps.push("C", "c");
                }
                if(!(playBack(key, ["D","E dorian","A Mixolydian", "B minor"], sharps, abc_split, '^'))){
                    sharps.push("G", "g");
                }
                if(!(playBack(key, ["A","B dorian","E Mixolydian", "F# minor"], sharps, abc_split, '^'))){
                    sharps.push("D", "d");
                }
                if(!(playBack(key, ["E","F# dorian","B Mixolydian", "C# minor"], sharps, abc_split, '^'))){
                    sharps.push("A", "a");
                }
                if(!(playBack(key, ["B","C# dorian","F# Mixolydian", "G# minor"], sharps, abc_split, '^'))){
                    sharps.push("E", "e");
                }
                if(!(playBack(key, ["F#","G# dorian","C# Mixolydian", "D# minor"], sharps, abc_split, '^'))){
                    sharps.push("B", "b");
                }    
                playBack(key, ["C#","D# dorian","G# Mixolydian", "A# minor"], sharps, abc_split, '^');
                if(!(playBack(key, ["F","G dorian","C Mixolydian", "D minor"], flats, abc_split, '_'))){
                    flats.push("E", "e");
                }
                if(!(playBack(key, ["Bb","C dorian","F Mixolydian", "G minor"], flats, abc_split, '_'))){
                    flats.push("A", "a");
                }
                if(!(playBack(key, ["Eb","F dorian","Bb Mixolydian", "C minor"], flats, abc_split, '_'))){
                    flats.push("D", "d");
                }
                if(!(playBack(key, ["Ab","Bb dorian","Eb Mixolydian", "F minor"], flats, abc_split, '_'))){
                    flats.push("G", "g");
                }    
                if(!(playBack(key, ["Db","Eb dorian","Ab Mixolydian", "Bb minor"], flats, abc_split, '_'))){
                    flats.push("C", "c");
                }    
                if(!(playBack(key, ["Gb","Ab dorian","Db Mixolydian", "Eb minor"], flats, abc_split, '_'))){
                    flats.push("F", "f");
                }    
                playBack(key, ["Cb","Db dorian","Gb Mixolydian", "Ab minor"], flats, abc_split, '_');
            }else{
                alert("unexpected error: selection was not found");
            }
        })
    })
    
    
    
    
    $('#tune_mode_input').change(function(){
        var id = $(this).find("option:selected").attr("id");
        switch (id){
            case "maj":
                $('#key').load('forms/mode_options/major.php?id=' + $('#key').find("option:selected").attr("id"), function(){$('#tune_mode_input').focus();});
            break;
            case "min":
                $('#key').load('forms/mode_options/minor.php?id=' + $('#key').find("option:selected").attr("id"), function(){$('#tune_mode_input').focus();});
            break;
            case "dor":
                $('#key').load('forms/mode_options/dorian.php?id=' + $('#key').find("option:selected").attr("id"), function(){$('#tune_mode_input').focus();});
            break;
            case "mix":
                $('#key').load('forms/mode_options/mixolydian.php?id=' + $('#key').find("option:selected").attr("id"), function(){$('#tune_mode_input').focus();});
            break;            
        }
        if($('#play').length){
            $('#play').remove();
        }
        start_new_abc();
    })  
    
    
    function start_new_abc(){        
        
        var hdr = build_abc_hdr(            
            $('#tune_title').val(), 
            $('#tune_type').val(), 
            $('#metre').val(), 
            $('#default_note_length').val(), 
            $('#key').val()            
        );
        
        abc_editor = new ABCJS.Editor("abc", { canvas_id: "canvas", midi_id:"midi", warnings_id:"warnings" });
        
        window.ABCJS.edit.EditArea.prototype.getString = function() {
            return hdr + this.textarea.value;
        }    
        
        $("#canvas").css("background-color", "FFFFFF");
        
    };
    
    //var editor1 = document.getElementById("abc");
    //editor1.spellcheck = false;
    
    
    var lastTitle = '';
    var lastType = $('#tune_type').find("option:selected").val();
    var lastTypeVal = '';
    var lastMetre = $('#metre').find("option:selected").attr("id");
    var lastMetreVal = '';
    var lastLength = $('#default_note_length').find("option:selected").attr("id");
    var lastLengthVal = '';
    var lastKey = $('#key').find("option:selected").attr("id");
    var lastKeyVal = '';
    var lastMode = $('#tune_mode_input').find("option:selected").attr("id");
    var lastModeVal = '';
    
    //triggers test if every 500ms if our input fields have changed. 
    setInterval(function (){   
        $("#canvas").css("background-color", "FFFFFF");
        if($('#tune_title').val() !== lastTitle){
            lastTitle = $('#tune_title').val();
            start_new_abc();                       
        }else            
        if($('#tune_type').find("option:selected").attr("id") !== lastType){
            lastType = $('#tune_type').find("option:selected").attr("id")
            start_new_abc();                       
        }else 
        if($('#tune_type').val() !== lastTypeVal){//second test for value dynamically updates content as you scroll through options
            lastTypeVal = $('#tune_type').val();
            start_new_abc();
        }    
        if($('#metre').find("option:selected").attr("id") !== lastMetre){
            lastMetre = $('#metre').find("option:selected").attr("id");
            start_new_abc();           
        }else 
        if($('#metre').val() !== lastMetreVal){//second test for value dynamically updates content as you scroll through options
            lastMetreVal = $('#metre').val();
            start_new_abc();
        }    
        if($('#default_note_length').find("option:selected").attr("id") !== lastLength){
            lastLength = $('#default_note_length').find("option:selected").attr("id");
            start_new_abc();            
        }else 
        if($('#default_note_length').val() !== lastLengthVal){//second test for value dynamically updates content as you scroll through options
            lastLengthVal = $('#default_note_length').val();
            start_new_abc();
        }    
        if($('#key').find("option:selected").attr("id") !== lastKey){
            lastKey = $('#key').find("option:selected").attr("id");
            start_new_abc();            
        } else 
        if($('#key').val() !== lastKeyVal){//second test for value dynamically updates content as you scroll through options
            lastKeyVal = $('#key').val();
            start_new_abc();
        }else    
        if($('#tune_mode_input').find("option:selected").attr("id") !== lastMode){
            /*
            since changing mode also changes the key now we need to actually test 
            for the value, and not the selected option (since the new option will 
            actually have the same id as the old one), works best nested here rather 
            than as a sibling to the other tests. 
            */
            var lastKey3 = '';
            var intervalId = setInterval(function(){
                if($('#key').val() !== lastKey3){
                   lastKey3 = $('#key').val();
                    start_new_abc();
                }        
            }, 666);
            lastMode = $('#tune_mode_input').find("option:selected").attr("id");
            start_new_abc();
        }
    }, 1000);    
    $('#tune_title').on('change keyup', function(){
         start_new_abc();
    })
    $('#tune_type').on("change", function(){
        if($(this).val() == "Add another"){
            //for some reason the width needs an extra 5 pixels to line up...
            var newTuneType = "<br /><label style='width: 153px;'>New Tune Type: </label><input type='text' id='new_tune_type'/>";
            $(this).after(newTuneType);
            //alert('test');
        }else{
            start_new_abc();
        }    
        
    })
    $('#metre').change(function(){
        start_new_abc();
    })
    $('#default_note_length').change(function(){
        start_new_abc();
    })
    $('#tune_mode_input').on('change keyup paste mouseup', function(){
        start_new_abc();
    })    
    $('#key').on('change mouseup', function(){        
        start_new_abc();        
    })
    $('#key').on('click', function(){
        if($('#play').length){
            $('#play').remove();
            //selection == '';
        }
    })
    $('#save').on('click', function(){
        var tune_body = $('#abc').val().replace(/\n/g, '<br />');
        $.post(
              "add_tune.php",
              {
                "tune_title":$("#tune_title").val(),
                "tune_type":$("#tune_type").val(),
                "composer":$("#composer").val(),
                "metre":$('#metre').val(),
                "default_note_length":'1/8',
                "tune_key":$('#key').val(),
                "tune_body": tune_body
              },
              function(data){
                  if(data == "Thank you. Your tune was submitted"){
                      alert(data);
                      $('#content').load('tunes.php');
                  }else{
                      alert(data);
                  }
                  
                  
              }
          );          
    })
    function build_abc_hdr(title, type, metre, length, key){
    
        var hdr = "X:1\n";
        if(title){
            hdr += "T:" + title + "\n";            
        }
        if(type){
            hdr += "R:" + type + "\n";
        }
        if(metre){
            hdr += "M:" + metre + "\n";
        }
        if(length){
            hdr += "L:" + length + "\n";
        }
        if(key){
            hdr += "K:" + key + "\n";
        }                
        return hdr;
    }
    
})
