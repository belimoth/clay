"use strict";

function app_toggle_fullscreen() {
	if ( document.fullscreen ) {
		document.exitFullscreen();
	} else {
		if ( document.body.requestFullscreen       ) { document.body.requestFullscreen();       } else
		if ( document.body.webkitRequestFullscreen ) { document.body.webkitRequestFullscreen(); } else
		if ( document.body.mozRequestFullScreen    ) { document.body.mozRequestFullScreen();    } else
		if ( document.body.msRequestFullscreen     ) { document.body.msRequestFullscreen();     }
	}

	if ( document.fullscreen ) {
		document.body.classList.add( "fullscreen" );
	} else {
		document.body.classList.remove( "fullscreen" );
	}
}

document.getElementById( "f11" ).addEventListener( "click", function() {
	app_toggle_fullscreen();
});

document.getElementById( "f12" ).addEventListener( "click", function() {
	document.body.classList.toggle( "focus" );
});

document.addEventListener( "keydown", function( event ) {
	if ( event.key == "F11" ) {
		event.preventDefault();
		app_toggle_fullscreen();
	}

	if ( event.key == "F12" ) {
		event.preventDefault();
		document.body.classList.toggle( "focus" );
	}
});

document.addEventListener( "fullscreenchange", function( event ) {
	if ( document.fullscreen ) {
		document.body.classList.add( "fullscreen" );
	} else {
		document.body.classList.remove( "fullscreen" );
	}
});
