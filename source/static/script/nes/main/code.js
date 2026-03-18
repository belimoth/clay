"use strict";

import { app } from "./app.js";
import { byte_to_asm } from "../nes/6502.js";

export async function code_draw() {
	let cdl_data = null;

	let response = await fetch( "static/data/nes/" + app.rom_name.replace( ".nes", ".cdl" ) );

	if ( response.ok ) {
		let blob = await response.blob();
		cdl_data = new Uint8Array( await blob.arrayBuffer() );
	} else return;

	let text = "";

	text = "<thead><th>#<th>Data<th>CDL<th>Label<th colspan=2>Op/Mode<th>A<th>X<th>Y<th>CZIVN<th>Description<th>Stack<tbody>";

	// let at_nmi   = app.nes.cpu.get_2( 0xFFFA );
	// let at_reset = app.nes.cpu.get_2( 0xFFFC );
	// let at_irq   = app.nes.cpu.get_2( 0xFFFE );

	let at_nmi   = app.nes.cpu.get_2( 0xFFFA ) - 0xC000;
	let at_reset = app.nes.cpu.get_2( 0xFFFC ) - 0xC000;
	let at_irq   = app.nes.cpu.get_2( 0xFFFE ) - 0xC000;

	let span = 0;

	// prg

	for ( let i = 0; i < app.nes.cart.rom_data.length; i++ ) {
		if ( span > 1 ) {
			span -= 1;
		} else {
			let el = app.nes.cart.rom_data[i];

			let el_class= "";

			let cdl = cdl_data[i].toString(2).padStart( 8, "0" );

			text +=
				"<tr class=" + el_class + ">" +
				"<td>" + i.toString(16).toUpperCase().padStart( 4, "0" ) +
				"<td>" + cdl +
				"<td>" + el.toString(16).toUpperCase().padStart( 2, "0" );

			let at      = "";
			let size = 1;



			let code = "";
			let mode = "";



			if ( cdl_data[i] & 0b00000001 ) {
				[ code, mode, size ] = byte_to_asm( el );
				span = size;
			}

			if ( size > 1 ) {
				for ( let j = 1; j < size; j++ ) {
					let el_next = app.nes.cart.rom_data[ i + j ];
					text  += " " + el_next.toString(16).toUpperCase().padStart( 2, "0" );
				}
			}

			if ( i == at_nmi   ) at = "<a id=nmi>NMI</a>";
			if ( i == at_reset ) at = "<a id=reset>Reset</a>";
			if ( i == at_irq   ) at = "<a id=irq>IRQ</a>";

			if ( i == ( ( 0xFFFA - 0x8000 ) & ( app.nes.cart.rom.prg_size - 1 ) ) ) at = "<a href=#nmi>#NMI</a>"
			if ( i == ( ( 0xFFFC - 0x8000 ) & ( app.nes.cart.rom.prg_size - 1 ) ) ) at = "<a href=#reset>#Reset</a>"
			if ( i == ( ( 0xFFFE - 0x8000 ) & ( app.nes.cart.rom.prg_size - 1 ) ) ) at = "<a href=#irq>#IRQ</a>"

			let a = "";
			let x = "";
			let y = "";
			let czivn = "";
			let fact  = "";
			let stack = "";

			if ( cdl_data[i] & 0b00000001 ) {
				a = "--";
				x = "--";
				y = "--";
				stack = "--";
				czivn = "-----"
			} else {
				let j = 1;

				while( cdl_data[ i + j ] == cdl_data[i] && j < 16 ) {
					text += " " + app.nes.cart.rom_data[ i + j ].toString(16).toUpperCase().padStart( 2, "00" );
					j++;
				}

				i = i + j - 1;
			}

			text +=
				"<td>" + at +
				"<td class=asm>" + code +
				"<td>" + mode +
				"<td>" + a +
				"<td>" + x +
				"<td>" + y +
				"<td>" + czivn +
				"<td>" + fact +
				"<td>" + stack;
		}
	}

	// chr
//
// 	for ( let i = 0; i < app.nes.cart.rom.chr_data.length; i++ ) {
// 		let cdl = "";
// 		let cdl_b = "";
// 		let label = "";
// 		let fact = "";
//
// 		text += "<tr><td>" + ( i + 0x3FFF ).toString( 16 ).toUpperCase().padStart( 4, "0" ) +
// 			"<td>" + app.nes.cart.rom.chr_data[i].toString( 16 ).toUpperCase().padStart( 4, "0" ) +
// 			"<td>" + cdl + "<td>" + cdl_b +
// 			"<td><td>" + label + "<td><td><td><td>" + fact;
// 	}

	document.getElementById( "code" ).innerHTML = text;
}
