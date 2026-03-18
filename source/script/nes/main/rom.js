"use strict";

import { app } from "./app.js"
import { code_draw } from "./code.js";
import { default as nes } from "../nes.js";

export function rom_draw() {
	var el_rom = document.getElementById( "rom" );
	el_rom.innerHTML = "";

	Object.keys( app.storage.rom ).forEach( function( el, i ) {
		var el_li = document.createElement( "li" );
		var el_a  = document.createElement( "a"  );

		el_a.dataset.key = el
		var key = el.split(".nes")[0];
		el_a.dataset.label = key.split( "(" )[0];
		el_a.dataset.region = "";

		try {
			nes.load( el );
			el_a.dataset.mapper = app.nes.cart.rom.mapper;
			el_a.dataset.hash   = app.nes.cart.rom.hash;
		} catch( error ) {
			console.warn( error );
		}

		el_a.addEventListener( "click", function( event ) {
			document.body.classList.add( "hide-overlay" );

			nes.stop();
			if ( app.audio && app.audio.context ) app.audio.context.close();
			delete( app.nes );

			app.rom_name = el;
			nes.init();
			app.nes.cpu.start();
			nes.load( el );
			nes.play();
			code_draw();

			document.getElementById( "page-rom-list" ).removeAttribute( "active" );
			document.getElementById( "page-rom-info" ).setAttribute( "active", "" );
			document.getElementById( "page-rom-edit" ).removeAttribute( "active" );
			document.getElementById( "page-rom-edit-upload" ).removeAttribute( "active" );
		});

		el_li.appendChild( el_a );
		el_rom.appendChild( el_li );
	});
}

export function rom_init() {
	app.storage = JSON.parse( localStorage.getItem( "data.nes" ) || "{ \"rom\" : {} }" );
	rom_draw();
}
