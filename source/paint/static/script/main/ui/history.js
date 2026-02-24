"use strict";

import { app} from "../../app.js"

var history_el = document.getElementById( "history" );

history_el.addEventListener( "mouseover", function( event ) {
	if ( event.target.closest( "a" ) ) {
		document.getElementById( "main" ).classList.add( "mute-active" );
		var i = history_el.children.length - Array.from( history_el.children ).indexOf( event.target.closest( "li" ) ) - 1;
		app.history_item = app.file.history.filter( el => el.i == i )[0];
		$$( "div.panel-tools > ul.tool-list > li" )[ app.history_item.tool_index  ].classList.add( "hover" );
		$$( "div.column-right ul.layer-list > li" )[ app.history_item.layer_index ].classList.add( "hover" );

		app.toRepaint = true;
	} else {
		document.getElementById( "main" ).classList.remove( "mute-active" );
		app.history_item = null;
		app.toRepaint = true;
	}
});

history_el.addEventListener( "mouseleave", function( event ) {
	document.getElementById( "main" ).classList.remove( "mute-active" );
	app.history_item = null;
	app.toRepaint = true;
});
