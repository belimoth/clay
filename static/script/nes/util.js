"use strict";

export function hex( text, digits ) {
	if ( text == undefined ) { return "".padStart( digits, "-" ); }
	text = text.toString( 16 );
	if ( text == undefined ) { return "".padStart( digits, "-" ); }
	return text.padStart( digits, "0" ).toUpperCase();
}

function unpack_bits( byte ) {
    var b7, b6, b5, b4, b3, b2, b1, b0;

    b7 = ( byte >> 7 ) & 1;
    b6 = ( byte >> 6 ) & 1;
    b5 = ( byte >> 5 ) & 1;
    b4 = ( byte >> 4 ) & 1;
    b3 = ( byte >> 3 ) & 1;
    b2 = ( byte >> 2 ) & 1;
    b1 = ( byte >> 1 ) & 1;
    b0 = ( byte >> 0 ) & 1;

    return [ b7, b6, b5, b4, b3, b2, b1, b0 ];
}

function pack_bits( b7, b6, b5, b4, b3, b2, b1, b0 ) {
    return (
        ( b7 << 7 ) |
        ( b6 << 6 ) |
        ( b5 << 5 ) |
        ( b4 << 4 ) |
        ( b3 << 3 ) |
        ( b2 << 2 ) |
        ( b1 << 1 ) |
        ( b0 << 0 )
    );
}

export function base64_to_buffer( text ) {
	var raw = window.atob( text );
	var array = new Uint8Array( raw.length );

	for ( var i = 0; i < raw.length; i += 1 ) {
		array[ i ] = raw.charCodeAt( i );
	}

	return array.buffer
}
