var ch = 30.789 / 4;

var spans = [];
var span_current = {
    type : cdl_data[0] & 0b00000001,
    start : 0,
}

for ( var i = 0; i < cdl_data.length; i += 1 ) {
    var type = cdl_data[i] & 0b00000001;

    if ( type != span_current.type ) {
        span_current.end = i - 1;
        spans.push( span_current );

        span_current = {
            type : cdl_data[i] & 0b00000001,
            start : i
        };
    } 
}

var byte_to_hex = [];

for ( var i = 0; i < 0x100; i += 1 ) {
    byte_to_hex[ i ] = i.toString( 16 ).padStart( 2, "0" );
}

// console.log( spans )

function array_to_string( array ) {
    var octet_array = new Array( array.length );
    
    for ( var i = 0; i < array.length; i += 1 ) {
        octet_array[ i ] = byte_to_hex[ array[ i ] ];
    }

    return octet_array.join( " " );
}

function render( stride ) {
    if ( false ) {
        console.log( array_to_string( nes_data ) );
        console.log( nes_data.toString( "hex" ) );

        console.log( array_to_string( rom_data.slice( 0x7ffc, 0x7ffd ) ) );

        var header = new rom_header( nes_data );

        var html = "";
        
        spans.forEach( function( el, i ) {
            var span = el;
            if ( el.type == 0b000001 ) {
                html += "<div>(" + span.type + ")[" + span.start + ", " + span.end + "]code</div>";
            } else {
                html += "<div>(" + span.type + ")[" + span.start + ", " + span.end + "]data</div>";
            }

            if ( i > 100 ) {
                return;
            }
        });

        el_hex.innerHTML = html;

        return;
    }

    // el_bar.style.left = stride * 3 * ch + 4 * ch +  "px";
    var w = 3*ch;
    w = 40;
    el_bar.style.transform = "translateX( " + stride * w + "px )";

    el_hex.innerHTML = "";

    var el = document.createElement( "div" );
    el.classList.add( "row"  );
    el.classList.add( "head" );
    el_hex.appendChild( el );

    for ( var j = 0x00; j < stride; j += 1 ) {
        var el_byte = document.createElement( "div" );
        el_byte.classList.add( "byte" );
        el_byte.innerText = "\xa0" + j.toString( 16 ).padStart( ( stride - 1 ).toString( 16 ).length, "0" ) + "\xa0";
        el.appendChild( el_byte );
    }

    el.innerHTML += "<div class=cell>text:mario.tbl</cell>"
    el.innerHTML += "<div class=cell>asm</cell>"

    for ( var i = 0x00; i < rom_data.length - stride; i += stride ) {
        if ( i >= 0x800 ) {
            // break;
        }

        var el = document.createElement( "div" );
        el.classList.add( "row" );
        el.dataset.address = i.toString( 16 ).padStart( 4, "0" );
        var text = "";

        for ( var j = 0x00; j < stride; j += 1 ) {
            var byte = rom_data[ i + j ].toString( 16 ).padStart( 2, "0" );
            // text += byte + " ";

            var el_byte = document.createElement( "div" );
            el_byte.classList.add( "byte" );
            el_byte.innerText = "\xa0" + byte + "\xa0";

            var cdl_byte = cdl_data[ i + j ];
            if ( cdl_byte & 0b00000001 ) {
                el_byte.classList.add( "cdl-code" );
            }

            if ( cdl_byte & 0b00000010 ) {
                el_byte.classList.add( "cdl-data" );
            }

            el.appendChild( el_byte );
        }
        

        if ( false ) {
            var el_cell = document.createElement( "div" );
            el_cell.classList.add( "cell" );
            var text = "";

            for ( var j = 0x00; j < stride; j += 1 ) {
                var code = rom_data[ i + j ];

                // var abc = "0 1 2 3 4 5 6 7 8 9 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z   © . , .,= ? ' !!".padEnd( 256 * 2, ". " );
                // el.innerHTML += abc.slice( code * 2, code * 2 + 2 );

                if ( true ) {
                    var abc = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_©.,*=?'*!".padEnd( 256, "\xa0" );
                    text += abc.slice( code, code + 1 );
                } else {
                    text += String.fromCharCode( rom_data[ i + j ] ).replace(/[\x00-\x1F\x7F-\x9F]/g, "." );
                }
            }

            el_cell.innerText = text;
            el.appendChild( el_cell );
        }

        for ( var j = 0x00; j < stride; j += 1 ) {
            var byte = rom_data[ i + j ];
            var el_cell = document.createElement( "div" );
            el_cell.classList.add( "byte" );
            var ins = get_instruction( byte );
            if ( ins ) {
                el_cell.innerText = ins;
            }
            el.appendChild( el_cell );
        }

        el_hex.appendChild( el );
    }
}

var drag = false;
var stride = 0x20;
var stride = 0x10;

render( stride );

el_bar.addEventListener( "mousedown", function( event ) {
    drag = true;
    el_bar.classList.add( "drag" );
});

el_hex.addEventListener( "mousemove", function( event ) {
    // var w = 3 * ch;
    var w = 40;

    if ( drag == true ) {
        stride = Math.max( 1, Math.floor( ( event.x - 4 * ch ) / w ) );
        el_bar.style.transform = "translateX( " + stride * w + "px )";
    }
});

function finish_restride( event ) {
    if ( drag ) {
        drag = false;
        el_bar.classList.remove( "drag" );
        render( stride );
    }
}

el_bar.addEventListener( "mouseup", finish_restride );
el_hex.addEventListener( "mouseup", finish_restride );