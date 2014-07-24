$(document).ready(function(){
    function start_new_abc(){
            //var abc_editor = '';
            var abc_code = "";
            var hdr_array = [["X:", 1], ["T:", $('#tune_title').val()], ["R:", $('#tune_type').val()], ["M:", $('#metre').val()],
                             ["L:", "1/8"], ["K:", $('#key').val()]];
            var hdr = build_abc_hdr(hdr_array);
            //alert(hdr);
            abc_code = $('#abc').val();
            //$('#abc').remove();
            
            //$('#abc_editor').append("<textarea id='abc' rows='10' cols='45' name='tune_body'>" + abc_code + "</textarea>");
            //$('#abc').prepend("<script type='text/javascript'>$('#abc').on('keypress', function(event){interpretSurroundingChars(event);})</script>");

            //$('#abc').val(abc_code);   
            if(!abc){

                abc_editor = new ABCJS.Editor("abc", { canvas_id: "canvas", midi_id:"midi", warnings_id:"warnings"});
                abc = true;
            }
            
            window.ABCJS.edit.EditArea.prototype.getString = function() {
                return hdr + this.textarea.value;
            }
        }
    })