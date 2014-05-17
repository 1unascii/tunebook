$(document).ready(function(){
    //var abc_editor = new ABCJS.Editor("abc", { canvas_id: "canvas0", midi_id:"midi", warnings_id:"warnings" });
    
    
    var lastValue = '';
    $('#abc').on('change keyup paste mouseup', function(){        
        $(this).attr('spellcheck', 'false');        
    })
    
    abc_editor = new ABCJS.Editor("abc", { canvas_id: "canvas0", midi_id:"midi", warnings_id:"warnings" });
    
})


