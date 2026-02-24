"use strict";

document.addEventListener( "contextmenu", function( event ) {
	event.preventDefault();
});

document.addEventListener( "wheel", function( event ) {
	if ( event.ctrlKey ) {
		event.preventDefault();
	}
});

document.addEventListener( "keydown", function( event ) {
	if ( event.ctrlKey && "-=".includes( event.key ) ) {
		event.preventDefault();
	}
});
