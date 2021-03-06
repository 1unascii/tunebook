$(document).ready(function(){
    var abc = false;
    var editor
    var selection = '';//for playing selections
    //var available_notes = new Array("C,", "D,", "E,", "F,", "G,", "A,", "B,", "C", "D", "E", "F", "G", "A", "B", "c", "d", "e", "f", "g", "a", "b", "c'", "d'", "e'", "f'", "g'", "a'", "b'");
    var sharps = ["F", "f"];//will have to change to empty array if the "playKeys()" function starts at 0 instead of 1
    var flats = ["B", "b"];//will have to change to empty array if the "playKeys()" function starts at 0 instead of 1
    var nineCharsAgo = '';
    var eightCharsAgo = '';
    var sevenCharsAgo = '';
    var sixCharsAgo = '';
    var fiveCharsAgo = '';
    var fourCharsAgo = '';
    var threeCharsAgo = '';
    var charBeforeLast = '';
    var lastChar = '';
    var nextChar = '';
    var charAfterNext = '';
    var threeCharsAhead = '';
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
    //currently the first elements ["B", "b"] and ["F", "f"] are not used in these arrays, the playKeys() function that uses these arrays starts looping at 1 instead of 0 index
    //it's important that ["E", "e"] and ["C", "c"] are at the second position of the array
    var flatsToPush = [["B", "b"], ["E", "e"], ["A", "a"], ["D", "d"], ["G", "g"], ["C", "c"], ["F", "f"]];
    var sharpsToPush = [["F", "f"], ["C", "c"], ["G", "g"], ["D", "d"], ["A", "a"], ["E", "e"], ["B", "b"]];

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

    function returnChar(selector, caretStart, caretEnd ) {
        //var index = text.indexOf(caretPos);
        return selector.substring(caretStart, caretEnd);
    }
    
    //fetches the current caret position and populates global variables with the surrounding characters to the caret   
    function findSurroundingChars() {
        var selector = document.getElementById("abc");
        var caretPos = GetCaretPosition(selector);
        nineCharsAgo = returnChar(selector.value, caretPos -9, caretPos -8);//nine chars back
        eightCharsAgo = returnChar(selector.value, caretPos -8, caretPos -7);//eight chars back
        sevenCharsAgo = returnChar(selector.value, caretPos -7, caretPos -6);//seven chars back
        sixCharsAgo = returnChar(selector.value, caretPos -6, caretPos -5);//six chars back
        fiveCharsAgo = returnChar(selector.value, caretPos -5, caretPos -4);//five chars back
        fourCharsAgo = returnChar(selector.value, caretPos -4, caretPos -3);//four chars back
        threeCharsAgo = returnChar(selector.value, caretPos -3, caretPos -2);//three chars back
        charBeforeLast = returnChar(selector.value, caretPos -2, caretPos -1);//two chars back
        lastChar = returnChar(selector.value, caretPos -1, caretPos);//last char
        nextChar = returnChar(selector.value, caretPos, caretPos +1);//next char
        charAfterNext = returnChar(selector.value, caretPos +1, caretPos +2);//next char
        threeCharsAhead = returnChar(selector.value, caretPos +2, caretPos +3);//three chars ahead
        fourCharsAhead = returnChar(selector.value, caretPos +3, caretPos +4);//four chars ahead
        fiveCharsAhead = returnChar(selector.value, caretPos +4, caretPos +5);//five chars ahead
        sixCharsAhead = returnChar(selector.value, caretPos +5, caretPos +6);//six chars ahead
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

    //when playing back a selection, to determine what notes should be altered according to the key argument
    function keySpecificPlayBack(key, accidentalArray, sharpsOrFlats, abcArray, accidentalChar, sharpsOrFlatsToPush){
        
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
    
    //really just send it a character and it tells if it's an ABC accidental. The symbols are ""
    function accidentalCharsAgo(charsAgo){
        if(charsAgo == '^' || charsAgo == '_' || charsAgo == '='){
            return true;
        }else {
            return false;
        }
    }

    //if the current key is in the keys array then play the content using the appropriate accidental modifiers
    function playKey(key, keys, args){
        if(key == keys[0] || key == keys[1] || key == keys[2] || key == keys[3]){
            if(args.length > 3){
                $(this).play(accidentalNotes(args[0], args[1], args[2], args[3]));
            }else {
                $(this).play(accidentalNotes(args[0], args[1], args[2]));
            }
            return true;
        }else{
            return false
        }
    }

    /*
    iterate through the keys array to see when the current key is matched. At every iteration, 
    add one more accidental sharps, or the flats global array. The accidentals are added in the 
    order of the circle of fifths. For sharps start at "F", adding C,G,D,A,E,B at each iteration. 
    For flats start at "B" and adding E,A,D,G,C,F at each iteration. When the key matches an 
    element in the keys array, the sharps or flats array should contain all the appropriate sharps 
    or flats for the key set that yeilded a match
    */
    function playKeys(key, keys, sharpsOrFlats, toPush, symbol, keyPress, bool){
        for(var i=1; i<keys.length; i++){
            if(bool){
                if(!playKey(key, keys[i], [sharpsOrFlats, symbol, keyPress, bool])){
                    sharpsOrFlats.push(toPush[i][0], toPush[i][1]);
                } else{
                    i = keys.length;
                    return true;
                }
            }else {
                if(!playKey(key, keys[i], [sharpsOrFlats, symbol, keyPress])){
                    sharpsOrFlats.push(toPush[i][0], toPush[i][1]);
                } else{
                    i = keys.length;
                    return true;
                }
            }
            
        }
        return false;
    }

    //insures that the global character values are updated on every click in the abc text area
    $('#abc').on("click", function(){
        findSurroundingChars();
    })
    
    function interpretSurroundingChars(event){
        findSurroundingChars();
        var key = $('#key').val();
        var c = event.which;//character code
        var keyPress = String.fromCharCode(c);//convert it to a string

        if(keyPress == '^' || keyPress == '_' || keyPress == '='){
            //Double Accidental with octave modifier
//TO DO!!! //will have to do some more recursive calculations here to test for multiple octave modifiers
            if(nextChar == keyPress && threeCharsAhead == ',' || threeCharsAhead == '\''){
                $(this).play(keyPress + nextChar + charAfterNext + threeCharsAhead);
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
            }else if(nextChar.match(letters) && charAfterNext == ',' || charAfterNext =='\''){
//TO DO Test for multiple modifiers
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
                if(fiveCharsAgo.match(letters)){
                    chars.unshift(sevenCharsAgo, sixCharsAgo, fiveCharsAgo);
                    $(this).play(letterCharsAgo(chars));
                }else
                if(sixCharsAgo.match(letters)){
                    chars.unshift(eightCharsAgo, sevenCharsAgo, sixCharsAgo, fiveCharsAgo);
                    $(this).play(letterCharsAgo(chars));
                }
                                  
            }else {

                if(key == "C" || key == "D dorian" || key == "G Mixolydian" || key == "A minor"){
                    $(this).play(lastChar + keyPress);
                }else
                /*
                Sharp keys. pass a bool equal to true to let the playKeys() function 
                know that the note is modified by octave
                */
                if(!playKeys(key, sharpsArray, sharps, sharpsToPush, '^', keyPress, true)){
                    playKeys(key, flatsArray, flats, flatsToPush, '_', keyPress, true);//Flat keys
                }
                
            }
        }else{

            //if keypress was not a modifier AND last key press also was not a modifier
            //then just play the keyed note value, modified by key, of course
            if(key == "C" || key == "D dorian" || key == "G Mixolydian" || key == "A minor"){
                $(this).play(keyPress);
            }else
            //Sharp keys. do not pass the bool value if the note is not modified by octave
            if(!playKeys(key, sharpsArray, sharps, sharpsToPush, '^', keyPress)){
                playKeys(key, flatsArray, flats, flatsToPush, '_', keyPress);//Flat keys
            }
            
        }
    
    }

    //play the notes as they are pressed
    //function keyPress();
    $('#abc').on('keypress', function(event){
        interpretSurroundingChars(event);
    });

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

    //inserts special characters where needed to comply with the key
    //also scans for triplets specified by the abc standard
    //even though I wrote this function I would be hard pressed to explain it in detail, not sure it
    //handles edge cases very well, should be tested more thoroughly
    function playBack(key, keys, accidentals, splitArray, modifier){

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
                
                sharps = new Array();
                flats = new Array();
                key = $('#key').val();

                //the selection is split into an array that is parsed by the keySpecificPlayback() function
                var abc_split = selection.split('');
                
                if(keySpecificPlayBack(key, sharpsArray, sharps, abc_split, '^', sharpsToPush)){
                    $('#abc').play(keySpecificPlayBack(key, sharpsArray, sharps, abc_split, '^', sharpsToPush));//jQuery Turtle plugin
                }else {
                    $('#abc').play(keySpecificPlayBack(key, flatsArray, flats, abc_split, '_', flatsToPush));
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
    /*A*/
    var editor1 = document.getElementById("abc");
    editor1.spellcheck = false;
    var lastKey = $('#key').find("option:selected").attr("id");
    var lastKeyVal = '';
    var lastMode = $('#tune_mode_input').find("option:selected").attr("id");
    var lastModeVal = '';
    
    
    //triggers test if every 1000ms if our input fields have changed.
    //this tends to drag really slow browsers/computers. The interval was changed from 500 to 1000 which seems fast enough
    setInterval(function (){        
        if($('#key').find("option:selected").attr("id") !== lastKey){
            lastKey = $('#key').find("option:selected").attr("id");
            start_new_abc();
        } else
        if($('#key').val() !== lastKeyVal){//second test for value dynamically updates content as you scroll through options
            lastKeyVal = $('#key').val();
            start_new_abc();
        }else
        if($('#tune_mode_input').find("option:selected").attr("id") !== lastMode){
            
            //since changing mode also changes the key now we need to actually test
            //for the value, and not the selected option (since the new option will
            //actually have the same id as the old one), works best nested here rather
            //than as a sibling to the other tests.
            
            var lastKey3 = '';
            var intervalId = setInterval(function(){
                if($('#key').val() !== lastKey3){
                   lastKey3 = $('#key').val();
                    start_new_abc();
                }
            }, 999); //should be different than the interval that it is nested in.
            lastMode = $('#tune_mode_input').find("option:selected").attr("id");
            start_new_abc();
        }
    }, 1000);
    
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
    /*
    var headers = [["X:", 1], ["T:", title], ["R:", type], ["M:", metre], ["L:", length], ["K:", key]];
    */
    //self explanatory. Builds the header content that abc.js needs in order to recognize the ABC code and render sheet music on the page
    function build_abc_hdr(headers){
        //var hdr = "<span class='tune_body' id='tune_body' style='white-space: pre;'>";// = headers[0][0] + [0][1];
        var hdr = "";
        for(i = 0; i < headers.length; i++){
            if(headers[i].length > 1){
                hdr += headers[i][0] + headers[i][1] + "\n";
            }
        }
        //hdr += "</span>"; will get closed later
        return hdr;
    }
    
})