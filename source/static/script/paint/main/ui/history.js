"use strict";

import { app} from "../../app.js"

var history_el = document.getElementById( "history" );

history_el.addEventListener( "mouseover", function( event ) {
	if ( event.target.closest( "a" ) ) {
		var i = history_el.children.length - Array.from( history_el.children ).indexOf( event.target.closest( "li" ) ) - 1;
		app.history_item = app.file.history.filter( el => el.i == i )[0];
		$$( "page#page-tool ul.tool-list > li" )[ app.history_item.tool_index  ].classList.add( "hover" );
		$$( "menu ul.layer-list > li" )[ app.history_item.layer_index ].classList.add( "hover" );

		app.toRepaint = true;
	} else {
		app.history_item = null;
		app.toRepaint = true;
	}
});

history_el.addEventListener( "mouseleave", function( event ) {
	app.history_item = null;
	app.toRepaint = true;
});
