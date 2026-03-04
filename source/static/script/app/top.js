"use strict";

$( "top" )._.delegate( "mousedown", "ul.menu-list > li > a:not([disabled])", function( event ) {
	document.body.classList.toggle( "app-overlay-show" );

	$$( "ul.menu-list > li.active" ).forEach( el => el.classList.remove( "active" ) );

	if ( document.body.classList.contains( "app-overlay-show" ) ) {
		event.target.closest( "li" ).classList.add( "active" );
	}

	event.stopPropagation();
});

document.body.addEventListener( "mousedown", function( event ) {
	if ( document.body.classList.contains( "app-overlay-show" ) ) {
		$$( "ul.menu-list > li.active" ).forEach( el => el.classList.remove( "active" ) );
		document.body.classList.remove( "app-overlay-show" )
	}
});

$( "top" )._.delegate( "mouseover", "ul.menu-list > li > a:not([disabled])", function( event ) {
	if ( document.body.classList.contains( "app-overlay-show" ) ) {
		$$( "ul.menu-list > li.active" ).forEach( el => el.classList.remove( "active" ) );
		event.target.closest( "li" ).classList.add( "active" );
	}
});

$$( "ul.menu-list > li > ul > li > a" ).forEach( function( el, i ) {
	el.addEventListener( "mousedown", function( event ) {
		event.stopPropagation();
	});
});

function top( el ) {
	this.el = el;
}

// traffic

function app_toggle_fullscreen() {
	if (
		document.fullscreenEnabled       ||
		document.webkitFullscreenEnabled ||
		document.mozFullScreenEnabled    ||
		document.msFullscreenEnabled
	) {
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

function app_window_on_fullscreen() {
	if ( document.fullscreen ) {
		document.body.classList.add( "fullscreen" );
	} else {
		document.body.classList.remove( "fullscreen" );
	}
}

document.addEventListener( "fullscreenchange",       app_window_on_fullscreen );
document.addEventListener( "webkitfullscreenchange", app_window_on_fullscreen );
document.addEventListener( "mozfullscreenchange",    app_window_on_fullscreen );
document.addEventListener( "MSFullscreenChange",     app_window_on_fullscreen );

//

function app_window_check_fullscreen() {
	// NOTE this will basically never work
	// if ( screen.width == window.innerWidth && screen.height == window.innerHeight ) {

	if ( screen.height == window.innerHeight ) {
		// NOTE unlike the following, this will only trigger on resize up, not down
		// onFullscreen();

		document.body.classList.add( "window-full" );
	} else {
		document.body.classList.remove( "window-full" );
	}
}

app_window_check_fullscreen();
