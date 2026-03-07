"use strict";

import { rom_draw } from "./rom.js";

var el_drop = document.getElementById( "drop" );

el_drop.ondragenter = function( event ) {
	el_drop.classList.add( "drag-over" );
};

el_drop.addEventListener( "dragover", function( event ) {
	event.preventDefault();
});

el_drop.addEventListener( "drop", function( event ) {
	event.preventDefault();

	el_drop.classList.remove( "drag-over" );

	if ( event.dataTransfer.items ) {
		for ( var i = 0; i < event.dataTransfer.items.length; i += 1 ) {
			if ( event.dataTransfer.items[i].kind == "file" ) {
				var file = event.dataTransfer.items[i].getAsFile();

				var reader = new FileReader();

				reader.onload = function() {
					var result = reader.result.split( "," )[ 1 ];
					app.storage.rom[ file.name ] = result;
					localStorage.setItem( "data.nes", JSON.stringify( app.storage ) );
					rom_draw();
				};

				reader.readAsDataURL( file )
			}
		}
	} else {
		// TODO
	}
});

el_drop.ondragleave = function( event ) {
	el_drop.classList.remove( "drag-over" );
};
