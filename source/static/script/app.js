"use strict";

window.app = {};

document.getElementById( "a-rom-edit" ).addEventListener( "click", function( event ) {
	document.getElementById( "page-rom-list" ).removeAttribute( "active" );
	document.getElementById( "page-rom-info" ).removeAttribute( "active" );
	document.getElementById( "page-rom-edit" ).setAttribute( "active", "" );
	document.getElementById( "page-rom-edit-upload" ).removeAttribute( "active" );
});

document.getElementById( "a-rom-edit-back" ).addEventListener( "click", function( event ) {
	document.getElementById( "page-rom-list" ).setAttribute( "active", "" );
	document.getElementById( "page-rom-info" ).removeAttribute( "active" );
	document.getElementById( "page-rom-edit" ).removeAttribute( "active" );
	document.getElementById( "page-rom-edit-upload" ).removeAttribute( "active" );
});

document.getElementById( "a-rom-info-back" ).addEventListener( "click", function( event ) {
	document.getElementById( "page-rom-list" ).setAttribute( "active", "" );
	document.getElementById( "page-rom-info" ).removeAttribute( "active" );
	document.getElementById( "page-rom-edit" ).removeAttribute( "active" );
	document.getElementById( "page-rom-edit-upload" ).removeAttribute( "active" );
});
