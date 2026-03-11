"use strict";

import { app} from "./app.js"

// TODO similar for canvas

document.getElementById( "menu" ).addEventListener( "wheel", function( event ) {
	// todo only capture if there is overflow(active scrollbar) maybe
	event.stopPropagation();
});

document.getElementById( "a-export" ).addEventListener( "click", function( event ) {
	document.getElementById( "download" ).href = app.context.render.canvas.toDataURL( "image/png" ).replace( "image/png", "application/octet-stream" );
	document.getElementById( "download" ).click();
});

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
