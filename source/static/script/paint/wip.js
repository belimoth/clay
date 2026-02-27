"use strict";

$( "div#top-menu" )._.delegate( "mousedown", "ul.menu-list > li > a:not([disabled])", function( event ) {
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

$( "div#top-menu" )._.delegate( "mouseover", "ul.menu-list > li > a:not([disabled])", function( event ) {
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

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

document.getElementById( "column-right" ).addEventListener( "wheel", function( event ) {
	// todo only capture if there is overflow(active scrollbar) maybe
	event.stopPropagation();
});

// TODO similar for canvas

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

document.getElementById( "a-export" ).addEventListener( "click", function( event ) {
	document.getElementById( "download" ).href = app.context.render.canvas.toDataURL( "image/png" ).replace( "image/png", "application/octet-stream" );
	document.getElementById( "download" ).click();
});

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

function replay() {
	app.toRewind = true;

	app.replay = true;
	app.replay_t = 0;
	app.replay_action_index = 0;

	app.toRepaint = true;
}

var writer = null;

function exportWebm() {
	writer = new WebMWriter({
		quality: 1.0,
		// fileWriter: null,
		frameRate: 60,
	});

	// app.file.history.forEach( function( el, i ) {
	// writer.addFrame( app.context.render.canvas );
	// });
}

document.addEventListener( "keypress", function( event ) {
	if ( event.key == " " ) {
		exportWebm();
		replay();
	}
});
