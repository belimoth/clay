"use strict";

// TODO similar for canvas

document.getElementById( "menu" ).addEventListener( "wheel", function( event ) {
	// todo only capture if there is overflow(active scrollbar) maybe
	event.stopPropagation();
});

document.getElementById( "a-export" ).addEventListener( "click", function( event ) {
	document.getElementById( "download" ).href = window.app.context.render.canvas.toDataURL( "image/png" ).replace( "image/png", "application/octet-stream" );
	document.getElementById( "download" ).click();
});

function replay() {
	window.app.toRewind = true;
	window.app.replay = true;
	window.app.replay_t = 0;
	window.app.replay_action_index = 0;
	window.app.toRepaint = true;
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
