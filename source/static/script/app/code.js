"use strict";


export function code_draw() {
	let text = "";

	app.nes.cart.rom_data.forEach( function( el, i ) {
		let el_class="";
		let fact=""


		text += "<tr class=" + el_class + "><td>" + i.toString(16).toUpperCase().padStart( 4, "0" ) + "<td>0x" + el.toString(16).toUpperCase().padStart( 2, "0" ) + "<td>" + fact;
	});

	document.getElementById( "code" ).innerHTML = text;
}
