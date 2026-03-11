$(document).ready(function(){
    var editor1 = document.getElementById("abc");
    editor1.spellcheck = false;
    var lastKey = $('#key').find("option:selected").attr("id");
    var lastKeyVal = '';
    var lastMode = $('#tune_mode_input').find("option:selected").attr("id");
    var lastModeVal = '';
    var abc = false;
    var selection = '';//for playing selections
    //var nineCharsAgo = '';
    //var eightCharsAgo = '';
    //var sevenCharsAgo = '';
    //var sixCharsAgo = '';
    //var fiveCharsAgo = '';
    var fourCharsAgo = '';
    var threeCharsAgo = '';
    var charBeforeLast = '';
    var lastChar = '';
    var nextChar = '';
    var charAfterNext = '';
    var threeCharsAhead = '';
    var fourCharsAhead = '';
    var letters = /^[a-zA-Z]+$/;
    var key = $('#key').val();//what key are we in?

    var sharpsArray = [ ["C","D dorian","G Mixolydian", "A minor"], ["G", "A dorian", "D Mixolydian", "E minor"],
                    ["D", "E dorian", "A Mixolydian", "B minor"], ["A", "B dorian", "E Mixolydian", "F# minor"],
                    ["E", "F# dorian", "B Mixolydian", "C# minor"], ["B", "C# dorian", "F# Mixolydian", "G# minor"],
                    ["F#", "G# dorian", "C# Mixolydian", "D# minor"]];
    var flatsArray = [ ["C","D dorian","G Mixolydian", "A minor"], ["F", "G dorian", "C Mixolydian", "D minor"],
                    ["Bb", "C dorian", "F Mixolydian", "G minor"], ["Eb", "F dorian", "Bb Mixolydian", "C minor"],
                    ["Ab", "Bb dorian", "Eb Mixolydian", "F minor"], ["Db", "Eb dorian", "Ab Mixolydian", "Bb minor"],
                    ["Gb", "Ab dorian", "Db Mixolydian", "Eb minor"], ["Cb", "Db dorian", "Gb Mixolydian", "Ab minor"]];

    var flatsToPush = [["B", "b"], ["E", "e"], ["A", "a"], ["D", "d"], ["G", "g"], ["C", "c"], ["F", "f"]];
    var sharpsToPush = [["F", "f"], ["C", "c"], ["G", "g"], ["D", "d"], ["A", "a"], ["E", "e"], ["B", "b"]];

    function returnChar(selector, caretStart, caretEnd ) {
        return selector.substring(caretStart, caretEnd);
    }

    //really just send it a character and it tells if it's an ABC accidental. The symbols are ""
    function accidentalCharsAgo(charsAgo){
        if(charsAgo == '^' || charsAgo == '_' || charsAgo == '='){
            return true;
        }else {
            return false;
        }
    }

    //returns the caret position to findSurroundingChars()
    function GetCaretPosition(ctrl) {
        var CaretPos = 0; // IE Support
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

    //renders sheet music based on the current values in each field
    function start_new_abc(){
        //var abc_editor = '';
        var abc_code = "";
        var hdr_array = [   ["X:", 1], ["T:", $('#tune_title').val()], ["R:", $('#tune_type').val()], 
                            ["M:", $('#metre').val()],["L:", "1/8"], ["K:", $('#key').val()]];
        var hdr = build_abc_hdr(hdr_array);        
        abc_code = $('#abc').val();        
        abc_editor = ABCJS.renderAbc("canvas", hdr + abc_code);               
    }

    //TO DO -- get this function to work in Firefox    
    //pretty self explanatory. called when the user has selected some text in the abc text area
    //doesn't work in Firefox :(
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

    //fetches the current caret position and populates global variables with the surrounding characters to the caret   
    function findSurroundingChars() {
        var selector = document.getElementById("abc");
        var caretPos = GetCaretPosition(selector);
        //nineCharsAgo = returnChar(selector.value, caretPos -9, caretPos -8);//nine chars back
        //eightCharsAgo = returnChar(selector.value, caretPos -8, caretPos -7);//eight chars back
        //sevenCharsAgo = returnChar(selector.value, caretPos -7, caretPos -6);//seven chars back
        //sixCharsAgCDEo = returnChar(selector.value, caretPos -6, caretPos -5);//six chars back
        fiveCharsAgo = returnChar(selector.value, caretPos -5, caretPos -4);//five chars back
        fourCharsAgo = returnChar(selector.value, caretPos -4, caretPos -3);//four chars back
        threeCharsAgo = returnChar(selector.value, caretPos -3, caretPos -2);//three chars back
        charBeforeLast = returnChar(selector.value, caretPos -2, caretPos -1);//two chars back
        lastChar = returnChar(selector.value, caretPos -1, caretPos);//last char
        nextChar = returnChar(selector.value, caretPos, caretPos +1);//next char
        charAfterNext = returnChar(selector.value, caretPos +1, caretPos +2);//next char
        threeCharsAhead = returnChar(selector.value, caretPos +2, caretPos +3);//three chars ahead
        fourCharsAhead = returnChar(selector.value, caretPos +3, caretPos +4);//four chars ahead
        //fiveCharsAhead = returnChar(selector.value, caretPos +4, caretPos +5);//five chars ahead
        //sixCharsAhead = returnChar(selector.value, caretPos +5, caretPos +6);//six chars ahead
    }
    
    //takes a list of notes that should be modified (depending on the key)
    //octave is a boolean //arg 1 => sharps, arg 2 => '^', arg 3 => keyPress, arg 4 => boolean
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

    //called when a letter was found behind a modifier character such as a comma or apostrophe 
    //e.g. "FFF,,,," should return "F,,,," where "__F,,,," should return "__F,,,,"
    //doesn't currently account for the key, so multiple octave modifiers will be out of tune until that code is written
    function letterCharsAgo(chars, key) {
        var output = '';
        // second character is one behind the found letter
        //so when it is an accidental
        if(accidentalCharsAgo(chars[1])){
            //pass along to test if it's a double
            return(doubleAccidentalCharsAgo(chars));
        }else {
            //no accidental was found
            //output will include everything but the last two characters (our suspected accidental notes)
            //TO DO handle for keys
            if(key !== void 0){

                //the code to handle different keys goes here

            }else{//no key specified
                //ars[0] = accidentalNotes()
                for(var i = 0; i < chars.length; i++){
                    if(i > 1){
                        output += chars[i];
                    }
                }
                if(output.length){
                    return output;
                }else {
                    return false;
                }
            }//no key specified
        }
    }

    //tests for a double accidental and appends it to the output if it exists
    //always called by letterCharsAgo
    function doubleAccidentalCharsAgo(chars) {
        var output = '';
        //var i = 0
        for(var i = 0; i < chars.length; i++) {
            //if the first char is an accidental
            if(i == 0) {
                //if the second char is the same accidental
                if(chars[0] == chars[1]) {
                    output += chars[0];
                }
            }else {
                //everything but the first char
                output += chars[i];
            }
        }
        if(output.length){
            return output;
        }else {
            return false;
        }
    }
    
    function interpretSurroundingChars(event){
        findSurroundingChars();
        var key = $('#key').val();
        var c = event.which;//character code
        var keyPress = String.fromCharCode(c);//convert it to a string

        if(keyPress == '^' || keyPress == '_' || keyPress == '='){
            //Double Accidental with octave modifier
            if(nextChar == keyPress && threeCharsAhead == ',' || threeCharsAhead == '\''){
                $(this).play(keyPress + nextChar + charAfterNext + threeCharsAhead);
                //keySpecificPlayBack(key, accidentalArray, sharpsOrFlats, [keyPress + nextChar + charAfterNext + threeCharsAhead], accidentalChar, sharpsOrFlatsToPush)
            //Double Accidental without octave modifier
            }else if(nextChar == keyPress){
                $(this).play(keyPress + nextChar + charAfterNext);
            //An accidental sandwiched between and accidental and a note with octave modifier
            }else if (lastChar == '^' || lastChar == '_' && nextChar.match(letters) && charAfterNext == ',' || charAfterNext == '\''){
                $(this).play(lastChar + keyPress + nextChar + charAfterNext)
            //accidental was sandwiched between accidental and a note
            }else if(lastChar == '^' || lastChar == '_' && nextChar.match(letters)){
                $(this).play(lastChar + keyPress + nextChar)
            //Accidental added before a letter with octave modifier
            }else if(nextChar.match(letters) && charAfterNext == ',' || charAfterNext =='\''){sfda
                $(this).play(keyPress + nextChar + charAfterNext);
            // "" "" without octave modifier
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

            if(charBeforeLast == '^' || charBeforeLast == '_' || charBeforeLast == '='){//if the user modified the note
                
                /**/

                if(threeCharsAgo == charBeforeLast){//just how modified is this note anyway?
                    //octave modifiers in front of keyPress //rare case that should be handled
                    if(nextChar == ',' || nextChar == '\''){
                        $(this).play(threeCharsAgo + charBeforeLast + lastChar + keyPress + nextChar);
                    } else {
                        $(this).play(threeCharsAgo + charBeforeLast + lastChar + keyPress);
                    }
                }else{//ok it's only a single accidental
                    $(this).play(charBeforeLast + lastChar + keyPress);
                }
            //multiple octave modifiers are used
            }else if(lastChar == ',' || lastChar == '\'') {
                var chars = [ fourCharsAgo, threeCharsAgo, charBeforeLast, lastChar, keyPress ];
                
                if(charBeforeLast.match(letters)){
                    $(this).play(letterCharsAgo(chars));
                }else
                if(threeCharsAgo.match(letters)){
                    chars.unshift(fiveCharsAgo);
                    $(this).play(letterCharsAgo(chars));
                }else
                if(fourCharsAgo.match(letters)){
                    chars.unshift(sixCharsAgo, fiveCharsAgo);
                    $(this).play(letterCharsAgo(chars));
                }else
                /*if(fiveCharsAgo.match(letters)){
                    chars.unshift(sevenCharsAgo, sixCharsAgo, fiveCharsAgo);
                    $(this).play(letterCharsAgo(chars));
                }else
                if(sixCharsAgo.match(letters)){
                    chars.unshift(eightCharsAgo, sevenCharsAgo, sixCharsAgo, fiveCharsAgo);
                    $(this).play(letterCharsAgo(chars));
                }*/

            /*KEYPRESS WAS AN OCTAVE MODIFIER (, or ') AND THE LAST CHARACTER WAS NOT*/                      
            }else {

                if(key == "C" || key == "D dorian" || key == "G Mixolydian" || key == "A minor"){
                    $(this).play(lastChar + keyPress);
                }else

                key = $('#key').val();
                abc = lastChar + keyPress;
                //the selection is split into an array that is parsed by the keySpecificPlayback() function
                var abc_split = abc.split('');
                
                /*The boolean at the end tells the keySpecificPlayback function that the keyPress was an octave modifier*/
                if(keySpecificPlayBack(key, sharpsArray, abc_split, '^', sharpsToPush)){
                    $('#abc').play(keySpecificPlayBack(key, sharpsArray, abc_split, '^', sharpsToPush));//jQuery Turtle plugin
                }else {
                    $('#abc').play(keySpecificPlayBack(key, flatsArray, abc_split, '_', flatsToPush));
                }
                
            }
        }else{

            //if keypress was not a modifier AND last key press also was not a modifier
            //then just play the keyed note value, modified by key, of course
            if(key == "C" || key == "D dorian" || key == "G Mixolydian" || key == "A minor"){
                $(this).play(keyPress);
            }else
            
            key = $('#key').val();
            //the selection is split into an array that is parsed by the keySpecificPlayback() function
            var abc_split = keyPress.split('');

            if(keySpecificPlayBack(key, sharpsArray, abc_split, '^', sharpsToPush)){
                $('#abc').play(keySpecificPlayBack(key, sharpsArray, abc_split, '^', sharpsToPush));//jQuery Turtle plugin
            }else {
                $('#abc').play(keySpecificPlayBack(key, flatsArray, abc_split, '_', flatsToPush));
            }


        }
    
    }

    //when playing back a selection, to determine what notes should be altered according to the key argument
    //builds the sharpsOrFlat Array 
    function keySpecificPlayBack(key, accidentalArray, abcArray, accidentalChar, sharpsOrFlatsToPush){
        
        sharpsOrFlats = new Array();

        for(var i = 0; i < accidentalArray.length; i++){
            //first and last have special cases //they call functions with null values
            //alert(accidentalArray[i]);
            if(i == 0 || i == accidentalArray.length){
                if(playBack(key, accidentalArray[i], [], abcArray, '')){
                    return playBack(key, accidentalArray[i], [], abcArray, '');
                }
            }else

            if((playBack(key, accidentalArray[i], sharpsOrFlats, abcArray, accidentalChar))){
                return playBack(key, accidentalArray[i], sharpsOrFlats, abcArray, accidentalChar);
            }
            sharpsOrFlats.push(sharpsOrFlatsToPush[i][0], sharpsOrFlatsToPush[i][1]);
        }
    }

    //inserts special characters where needed to comply with the key
    //also scans for triplets specified by the abc standard
    //even though I wrote this function I would be hard pressed to explain it in detail, not sure it
    //handles edge cases very well, should be tested more thoroughly. Some edge cases are handled by keySpecificPlayback()
    function playBack(key, keys, accidentals, splitArray, modifier){
        start_new_abc();
        //an empty string to be returned
        var new_abc = '';
        //testing if the key matches any key in the sharpsArray or flatsArray
        if(key == keys[0] || key == keys[1] || key == keys[2] || key == keys[3]){
            for(var i = 0; i < splitArray.length; i++){
                //accidental detection
                for(var c = 0; c < accidentals.length; c++){
                    if(accidentals[c] == splitArray[i] && splitArray[i-1] !== '^' && splitArray[i-1] !== '_' && splitArray[i-1] !== '='){
                        //accidentals are being added here
                        splitArray[i] = modifier + splitArray[i];
                    }
                }
                //triplet detection
                if(splitArray[i] == '3' && splitArray[i-1] == '(' ){
                    var count = 0;
                    var count2 = 1;
                    while(count < 2){
                        //all of these characters will break the triplet processing
                        if(splitArray[i + count2] !== ' ' && splitArray[i + count2] !== '^' && splitArray[i + count2]
                            !== '_' && splitArray[i + count2] !== '=' && splitArray[i + count2]
                            !== ',' && splitArray[i + count2] !== '\'' && splitArray[i + count2]
                            !== '/' && splitArray[i + count2] !== '\'/' && splitArray[i + count2] !== ',/')
                        {
                            for(var c=0; c<accidentals.length; c++){
                                if(accidentals[c] == splitArray[i + count2]){
                                    //accidentals are being added
                                    splitArray[i + count2] = modifier + splitArray[i + count2];
                                }
                            }
                            //detecting octave modifiers
                            //TO DO detect multiple octaves --low priority 
                            //....actually I'm not sure it needs to be handled here
                            if(splitArray[i + count2 + 1] == ',' || splitArray[i + count2 + 1] == '\''){
                                //this character cuts the note value in half, in the playback this will give a realistic triplet rhythm
                                splitArray[i + count2 + 1] = splitArray[i + count2 + 1] + '/';
                            }else{
                                //this character cuts the note value in half, in the playback this will give a realistic triplet rhythm
                                splitArray[i + count2] = splitArray[i + count2] + '/';
                            }
                            count++;
                        }
                        count2++;
                    }
                }
                //reassemble the array back into a string
                new_abc += splitArray[i];
            }
            $('#play').fadeOut(250);
            return new_abc;
        }else {
            return false;
        }
    }

    //insures that the global character values are updated on every click in the abc text area
    $('#abc').on("click", function(){
        findSurroundingChars();
    })

    //play the notes as they are pressed
    //function keyPress();
    $('#abc').on('keypress', function(event){
        key = $('#key').val();
        interpretSurroundingChars(event);
    });

    //when abc code is slected create a playback box
    $('#abc').on('select keyup', function(){
        
        key = $('#key').val();
        selection = getSelectionText();
        //$('#abc').selection();
        //selection = $('#abc').selection();
        if(selection){
            $('#play_selection').html("<input type='button' id='play' value='Play Selection'/>");
        }

        //the generated playback button was clicked
        $('#play').on("click", function(){
            if(selection){
                
                //sharps = new Array();
                //flats = new Array();
                key = $('#key').val();

                //the selection is split into an array that is parsed by the keySpecificPlayback() function
                var abc_split = selection.split('');
                
                if(keySpecificPlayBack(key, sharpsArray, abc_split, '^', sharpsToPush)){
                    $('#abc').play(keySpecificPlayBack(key, sharpsArray, abc_split, '^', sharpsToPush));//jQuery Turtle plugin
                }else {
                    $('#abc').play(keySpecificPlayBack(key, flatsArray, abc_split, '_', flatsToPush));
                }
                                
                
            }else{
                alert("unexpected error: selection was not found");

            }
        })
    })

    //change the key options when the mode is changed
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

    
    
    //if any of these fields change the abc should be updated
    //once again this can drag slower computers.
    $('#tune_title').on('change', function(){         
         start_new_abc();
    });
    $('#tune_type').on("change", function(){
        if($(this).val() == "Add another"){
            //for some reason the width needs an extra 5 pixels to line up...
            //var newTuneType = "<br /><label style='width: 153px;'>New Tune Type: </label><input type='text' id='new_tune_type'/>";
            //$(this).after(newTuneType);
            alert('test');
        }else{
            //$('#canvas_wrapper').load("<div id='canvas' ></div><script src='abcjs_editor_1.8-min.js' type='text/javascript'></script>");
            start_new_abc();
        }
        
    });
    $('#metre').change(function(){
        //$('#canvas_wrapper').load("<div id='canvas' ></div><script src='abcjs_editor_1.8-min.js' type='text/javascript'></script>");
        start_new_abc();
    })
    $('#tune_mode_input').on('change keyup paste mouseup', function(){
        //$('#canvas_wrapper').load("<div id='canvas' ></div><script src='abcjs_editor_1.8-min.js' type='text/javascript'></script>");
        start_new_abc();
    })
    $('#key').on('change mouseup', function(){
        //$('#canvas_wrapper').load("<div id='canvas' ></div><script src='abcjs_editor_1.8-min.js' type='text/javascript'></script>");
        start_new_abc();
    })
    $('#key').on('click', function(){
        if($('#play').length){
           // $('#canvas_wrapper').load("<div id='canvas' ></div><script src='abcjs_editor_1.8-min.js' type='text/javascript'></script>");       
           $('#play').remove();
            selection == '';
        }
    })
    $('#abc').on('change keyup', function(){
        //$('#canvas_wrapper').load("<div id='canvas' ></div><script src='abcjs_editor_1.8-min.js' type='text/javascript'></script>");       
        start_new_abc();
    })

    //save the tune to the database!
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
})