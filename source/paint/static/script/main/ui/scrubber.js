"use strict";

var scrubber = document.getElementById( "scrubber" );
var height = scrubber.offsetHeight;
scrubber.children[0].style.height = height * 2 + "px";

var myImpetus = new Impetus({
	source: scrubber,
	update: function( x, y ) {
		var offset = ( Math.floor( y ) % height + height ) % height - height ;
		scrubber.children[0].style.transform = "translateY(" + offset + "px )";
	}
});
