"use strict";

import                   "../app/top.js";
import { tab_list } from "../app/tab-list.js"

import { app }                from "./main/app.js";
import                             "./main/drop.js";
import { rom_init, rom_draw } from "./main/rom.js";

if ( window.Worker ) {
	var worker = new Worker( "worker.js" );
	worker.postMessage( "ok ok ok" );
} else {

}

window.onblur = function( event ) {

};

import { default as nes } from "./nes.js";

nes.init();
rom_init();

// Z:\belimoth\data\data.subhelion.com\rom\nes

document.getElementById( "a-rom-edit-clear" ).addEventListener( "click", function ( event ) {
	app.storage.rom = {};
	localStorage.setItem( "data.nes", JSON.stringify( app.storage ) );
	rom_draw();
});

document.getElementById( "a-rom-edit-upload" ).addEventListener( "click", async function ( event ) {
	try {
		let handle = await window.showDirectoryPicker({ mode: "readwrite", startIn: "desktop" });

		for await ( let el of handle.values() ) {
			if ( el.kind == "file" ) {
				let file = await el.getFile();

				if ( file.name.split('.').pop().toLowerCase() == "nes" ) {
					let reader = new FileReader();

					reader.onload = function() {
						let result = reader.result.split( "," )[ 1 ];
						app.storage.rom[ file.name ] = result;
						localStorage.setItem( "data.nes", JSON.stringify( app.storage ) );
						rom_draw();
					};

					reader.readAsDataURL( file );
				}
			}
		}
	} catch ( error ) {

	}
});

// document.getElementById( "a-side-close" ).addEventListener( "click", function( event ) {
//     let i_static = 0;
//
//     Array.from( document.getElementById( "side-tab" ).children ).forEach( function( el, i ) {
//         if ( el.hasAttribute( "active" ) ) {
//             el.setAttribute( "hidden", "" );
//             i_static = i;
//         }
//     });
//
//     let j = 0;
//
//     Array.from( document.getElementById( "side-tab" ).children ).forEach( function( el, i ) {
//         if ( ! el.hasAttribute( "hidden" ) ) {
//             if ( j == i_static ) el.setAttribute( "active", "" );
//             j++;
//         }
//     });
//
//     if ( i_static >= j ) {
//         console.log( i_static );
//         console.log( j );
//         i_static = j - 1;
//     }
//
//     j = 0;
//
//     Array.from( document.getElementById( "side-tab" ).children ).forEach( function( el, i ) {
//         if ( ! el.hasAttribute( "hidden" ) ) {
//              if ( j == i_static ) el.setAttribute( "active", "" );
//             j++;
//         }
//     });
// });

new tab_list( document.getElementById( "side-tab" ) );
new tab_list( document.getElementById( "main-tab" ) );
new tab_list( document.getElementById( "tray-tab" ) );

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
