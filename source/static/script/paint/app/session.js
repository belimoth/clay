"use strict";

// https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API

function storage_test( type ) {
	try {
		let storage = window[type], x = "__storage_test__";
		storage.setItem( x, x );
		storage.removeItem( x );
		return true;
	} catch( ex ) {
		return ex instanceof DOMException && (
			e.code == 22                   ||
			e.code == 1014                 ||
			e.name == "QuotaExceededError" ||
			e.name == "NS_ERROR_DOM_QUOTA_REACHED"
		) && storage.length != 0;
	}
}

export function storage() {
	this.session = 0;

	this.get = key => {};
	this.set = key => {};

	if ( ! storage_test( "localStorage" ) ) return;
	if ( localStorage.length > 0 ) { /* TODO */ }

	window.addEventListener( "storage", function( event ) {
		// TODO
	});

	this.get = key => localStorage.getItem( key );
	this.set = ( key, value ) => localStorage.setItem( key, value );

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
