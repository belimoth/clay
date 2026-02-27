"use strict";

import { app, app_canvas_resize } from "../../app.js"

document.getElementById( "column-right" ).addEventListener( "mouseout", function( event ) {
	// $$( "div.column-right div.panel-header > a" ).forEach( el => el.classList.remove( "mute" ) );
	$$( "div.column-right div.panel-header > a" ).forEach( el => el.classList.remove( "hover" ) );
});

document.getElementById( "column-right" ).addEventListener( "mousemove", function( event ) {
	$$( "div.column-right div.panel-header > a" ).forEach( el => el.classList.remove( "mute" ) );
	$$( "div.column-right div.panel-header > a" ).forEach( el => el.classList.remove( "hover" ) );
});

document.getElementById( "a-layer-expand" ).addEventListener( "click", function( event ) {
	if( event.target.closest( "a" ).hasAttribute( "disabled" ) ) { return; }

	$$( "div.column-right div.panel-header > a" ).forEach( el => el.classList.remove( "mute" ) );
	$$( "div.column-right div.panel-header > a" ).forEach( el => el.classList.remove( "hover" ) );

	event.target.classList.add( "mute" );
	app.layer_mode_index = Math.max( app.layer_mode_index - 1, 0 );

	if ( app.layer_mode_index  == 1 ) {
		document.getElementById( "a-layer-collapse" ).classList.add( "hover" );
	}

	// wait_frame( function() {
		update_layer_mode();
	// });
});

document.getElementById( "a-layer-collapse" ).addEventListener( "click", function( event ) {
	if( event.target.closest( "a" ).hasAttribute( "disabled" ) ) { return; }

	$$( "div.column-right div.panel-header > a" ).forEach( el => el.classList.remove( "mute" ) );
	$$( "div.column-right div.panel-header > a" ).forEach( el => el.classList.remove( "hover" ) );

	event.target.classList.add( "mute" );
	app.layer_mode_index = Math.min( app.layer_mode_index + 1, 2 );

	if ( app.layer_mode_index  == 2 ) {
		document.getElementById( "a-layer-expand" ).classList.add( "hover" );
	}

	// wait_frame( function() {
		update_layer_mode();
	// });
});

document.getElementById( "a-layer-close" ).addEventListener( "click", function( event ) {
	app.layer_mode_index = 1;
	update_layer_mode();
});

export function update_layer_mode() {
	var modes =  [ "full", "normal", "focus", "hidden" ];
	var mode = modes[ app.layer_mode_index  ];
	modes.forEach( el => document.getElementById( "main" ).classList.remove( "layer-" + el ) );
	document.getElementById( "main" ).classList.add( "layer-" + mode );

	app.storage.set( "app.mode.layer", app.layer_mode_index );

	// TODO this is lazy
	app_canvas_resize();
}

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var tool_mode_index = 2;

document.getElementById( "menu" ).addEventListener( "mousemove", function( event ) {
	$$( "div.panel-menu div.panel-header > a" ).forEach( el => el.classList.remove( "mute" ) );
	// $$( "div.menu div.panel-header > a" ).forEach( el => el.classList.remove( "hover" ) );
});

document.getElementById( "a-tools-expand" ).addEventListener( "click", function( event ) {
	if( event.target.closest( "a" ).hasAttribute( "disabled" ) ) { return; }

	// $$( "div.column-right div.panel-header > a" ).forEach( el => el.classList.remove( "mute" ) );
	// $$( "div.column-right div.panel-header > a" ).forEach( el => el.classList.remove( "hover" ) );

	event.target.classList.add( "mute" );
	tool_mode_index = Math.max( tool_mode_index - 1, 0 );

	if ( tool_mode_index  == 1 ) {
		// document.getElementById( "a-tools-collapse" ).classList.add( "hover" );
	}

	// wait_frame( function() {
		update_tool_mode();
	// });
});

document.getElementById( "a-tools-collapse" ).addEventListener( "click", function( event ) {
	if( event.target.closest( "a" ).hasAttribute( "disabled" ) ) { return; }

	// $$( "div.column-right div.panel-header > a" ).forEach( el => el.classList.remove( "mute" ) );
	// $$( "div.column-right div.panel-header > a" ).forEach( el => el.classList.remove( "hover" ) );

	// event.target.classList.add( "mute" );
	tool_mode_index = Math.min( tool_mode_index + 1, 2 );

	if ( tool_mode_index  == 2 ) {
		// document.getElementById( "a-tools-expand" ).classList.add( "hover" );
	}

	// wait_frame( function() {
		update_tool_mode();
	// });
});

export function update_tool_mode() {
	// DUMB doesn't work because it's not a <button>
	// document.getElementById( "a-tools-expand" ).disabled = tool_mode_index == 1;

	if ( tool_mode_index == 1 ) {
		// document.getElementById( "a-tools-expand" ).setAttributeNode( document.createAttribute( "disabled" ) );
		document.getElementById( "a-tools-expand" ).setAttribute( "disabled", "" );
	} else {
		document.getElementById( "a-tools-expand" ).removeAttribute( "disabled" );
	}

	var modes =  [ "full", "normal", "focus", "hidden" ];
	var mode = modes[ tool_mode_index  ];
	modes.forEach( el => document.getElementById( "main" ).classList.remove( "tools-" + el ) );
	document.getElementById( "main" ).classList.add( "tools-" + mode );

	app.storage.set( "app.mode.tools", tool_mode_index );

	// TODO this is lazy
	app_canvas_resize();
}
