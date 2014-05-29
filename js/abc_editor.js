$(document).ready(function(){
    var abc = false;
    var editor 
    var selection = '';//for playing selections
    //var available_notes = new Array("C,", "D,", "E,", "F,", "G,", "A,", "B,", "C", "D", "E", "F", "G", "A", "B", "c", "d", "e", "f", "g", "a", "b", "c'", "d'", "e'", "f'", "g'", "a'", "b'");
    var sharps = new Array();
    var flats = new Array();
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
    var flatsToPush = [["B", "b"], ["E", "e"], ["A", "a"], ["D", "d"], ["G", "g"], ["C", "c"], ["F", "f"]];
    var sharpsToPush = [["F", "f"], ["C", "c"], ["G", "g"], ["D", "d"], ["A", "a"], ["E", "e"], ["B", "b"]];

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
   
   function letterCharsAgo(chars) {
        var output = '';
        // second character is one behind the found letter
        //so when it is an accidental
        if(accidentalCharsAgo(chars[1])){
            //pass along to test if it's a double
            return(doubleAccidentalCharsAgo(chars));
        }else {
            //no accidental was found
            //output will include everything but the last two characters (our suspected accidental notes)
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
    
    //tests for an accidental the specified number of Characters Ago (charsAgo) e.g. fourCharsAgo /
    function accidentalCharsAgo(charsAgo){
        if(charsAgo == '^' || charsAgo == '_' || charsAgo == '='){
            return true;
        }else {
            return false;
        }
    }
    function playKey(key, keys, args){
        if(key == keys[0] || key == keys[1] || key == keys[2] || key == keys[3]){
            $(this).play(accidentalNotes(args[0], args[1], args[2], args[3]));
            return true;
        }else{
            return false
        }   
    }
    function playSharpKeys(key, keys){
        for(var i=1; i<keys.length; i++){
            if(!playKey(key, keys[i], [sharps, '^', keyPress, true])){
                sharps.push(sharpsToPush[i][0], sharpsToPush[i][1]);
            } else{
                i = keys.length;
                return true;
            }
        }
        return false;
    }
    function playKeysWithMod(key, keys, sharpsOrFlats, toPush, symbol, keyPress, boolOfTrue){
        for(var i=1; i<keys.length; i++){
            if(!playKey(key, keys[i], [sharpsOrFlats, symbol, keyPress, boolOfTrue])){
                sharpsOrFlats.push(toPush[i][0], toPush[i][1]);
            } else{
                i = keys.length;
                return true;
            }
        }
        return false;
    }
    function playKeys(key, keys, sharpsOrFlats, toPush, symbol, keyPress, boolOfFalse){
        for(var i=1; i<keys.length; i++){
            if(!playKey(key, keys[i], [sharpsOrFlats, symbol, keyPress])){
                sharpsOrFlats.push(toPush[i][0], toPush[i][1]);
            } else{
                i = keys.length;
                return true;
            }
        }
        return false;
    }

    $('#abc').on("click", function(){
        findSurroundingChars();
    })
    

    //play the notes as they are pressed
    //function keyPress();
    $('#abc').on('keypress', function(event){


        findSurroundingChars();
        var key = $('#key').val();
        var c = event.which;//character code
        var keyPress = String.fromCharCode(c);//convert it to a string

        //letterCharsAgo is only called after a character match is found to be true
        //it recieves a special character array which are the characters which
        //must be parsed in this instance
        

        if(keyPress == '^' || keyPress == '_' || keyPress == '='){
            //Double Accidental with octave modifier
            //TO DO!!!
            //will have to do some more recursive calculations here to test for multiple octave modifiers
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
            //sharps = [];
            //sharps.push("F", "f");
            //flats = [];
            //flats.push("B", "b");
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
                //Sharp keys
                if(!playKeysWithMod(key, sharpsArray, ["F", "f"], sharpsToPush, '^', keyPress, true)){
                    playKeysWithMod(key, flatsArray, ["B", "b"], flatsToPush, '_', keyPress, true)
                }
                
            }
        }else{//if keypress was not a modifier AND last key press also was not a modifier
            //then just play the keyed note value, modified by key, of course

            if(key == "C" || key == "D dorian" || key == "G Mixolydian" || key == "A minor"){
                $(this).play(keyPress);
            }else
            //Sharp keys
            if(!playKeysWithMod(key, sharpsArray, ["F", "f"], sharpsToPush, '^', keyPress, false)){
                playKeysWithMod(key, flatsArray, ["B", "b"], flatsToPush, '_', keyPress, false)
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
    //inserts special characters where needed to comply with the key
    //also scans for triplets specified by the abc standard
    function playBack(key, keys, accidentals, splitArray, modifier){
        var new_abc = '';
        //testing if the key matches a specified key
        if(key == keys[0] || key == keys[1] || key == keys[2] || key == keys[3]){
            for(var i = 0; i < splitArray.length; i++){
                //accidental or octave mod detection
                for(var c = 0; c < accidentals.length; c++){
                    if(accidentals[c] == splitArray[i] && splitArray[i-1] !== '^' && splitArray[i-1] !== '_' && splitArray[i-1] !== '='){
                        //accidentals or octave modifiers are being added here
                        splitArray[i] = modifier + splitArray[i];
                    }
                }
                //triplet detection
                if(splitArray[i] == '3' && splitArray[i-1] == '(' ){
                    var count = 0;
                    var count2 = 1;
                    while(count < 2){
                        //triplet detection has it's own accidental detection .... for now
                        if(splitArray[i + count2] !== ' ' && splitArray[i + count2] !== '^' && splitArray[i + count2]
                            !== '_' && splitArray[i + count2] !== '=' && splitArray[i + count2]
                            !== ',' && splitArray[i + count2] !== '\'' && splitArray[i + count2]
                            !== '/' && splitArray[i + count2] !== '\'/' && splitArray[i + count2] !== ',/')
                        {
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
            
            //alert(new_abc);
            $('#play').fadeOut(250);
            return new_abc;
        }else {
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
                
                sharps = new Array();
                flats = new Array();
                key = $('#key').val();
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
        
        var hdr_array = [["X:", 1], ["T:", $('#tune_title').val()], ["R:", $('#tune_type').val()], ["M:", $('#metre').val()],
                         ["L:", $('#defaule_note_length').val()], ["K:", $('#key').val()]];
        var hdr = build_abc_hdr(hdr_array);
        if(!abc){

            var abc_editor = new ABCJS.Editor("abc", { canvas_id: "canvas", midi_id:"midi", warnings_id:"warnings"});            
            abc = true;
        }
        
        window.ABCJS.edit.EditArea.prototype.getString = function() {
            return hdr + this.textarea.value;
        }
        
    }
    /*A*/
    var editor1 = document.getElementById("abc");
    editor1.spellcheck = false;    
    var lastKey = $('#key').find("option:selected").attr("id");
    var lastKeyVal = '';
    var lastMode = $('#tune_mode_input').find("option:selected").attr("id");
    var lastModeVal = '';
    
    
    //triggers test if every 500ms if our input fields have changed. 
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
            }, 666);
            lastMode = $('#tune_mode_input').find("option:selected").attr("id");
            start_new_abc();
        }
    }, 1000);  
    $('#tune_title').on('change keyup', function(){
         start_new_abc();
    });
    $('#tune_type').on("change", function(){
        if($(this).val() == "Add another"){
            //for some reason the width needs an extra 5 pixels to line up...
            var newTuneType = "<br /><label style='width: 153px;'>New Tune Type: </label><input type='text' id='new_tune_type'/>";
            $(this).after(newTuneType);
            alert('test');
        }else{
            start_new_abc();
        }
        
    });
    $('#metre').change(function(){
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
            selection == '';
        }
    });
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
    function build_abc_hdr(headers){
        var hdr = headers[0][0] + [0][1];
        for(i = 0; i < headers.length; i++){
            if(headers[i].length){
                hdr += headers[i][0] + headers[i][1] + "\n";
            }
        }
        return hdr;
    }
    
})