"use strict";

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API

function storageAvailable( type ) {
	try {
		var storage = window[type], x = '__storage_test__';
		storage.setItem( x, x );
		storage.removeItem( x );
		return true;
	} catch( ex ) {
		return ex instanceof DOMException && (
			e.code === 22   ||						// everything except Firefox
			e.code === 1014 ||						// Firefox

			// test name field too, because code might not be present

			e.name === 'QuotaExceededError' ||		// everything except Firefox
			e.name === 'NS_ERROR_DOM_QUOTA_REACHED'	// Firefox
		) && storage.length !== 0;					// acknowledge QuotaExceededError only if there's something already stored
	}
}

export function storage() {
	this.session = 0;

	this.get = function( key ) {};
	this.set = function( key ) {};

	if ( ! storageAvailable( "localStorage" ) ) { return; }
	if ( localStorage.length > 0 ) { /* TODO */ }

	window.addEventListener( "storage", function( event ) {
		// TODO
	});

	// NOTE unnecessary

	// this.get = function( key, valueDefault = null ) {
	// 	var value = localStorage.getItem( key );

	// 	if ( value == null && valueDefault != null ) {
	// 		value = valueDefault;
	// 		localStorage.setItem( key, value );
	// 	}

	// 	return value
	// }

	this.get = function( key ) {
		return localStorage.getItem( key );
	}

	this.set = function( key, value ) {
		return localStorage.setItem( key, value );
	}

	this.usage = function() {
		var total = 0;

		for ( var i = 0; i < localStorage.length; i += 1 ){
			var key = localStorage.key( i );
			var amount = ( ( key.length + localStorage[ key ].length ) * 2 ) / 1024 / 1024;
			total += amount;
		}

		return total.toFixed(2) + " MB";
	}
}


/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

// NOTE unnecessary
// app.layer_mode_index = app.storage.get( "app.mode.layer", 1 );
// app.tool_mode_index  = app.storage.get( "app.mode.tool" , 2 );



/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
