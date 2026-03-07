"use strict";

import "../app/top.js";
import "../app/drop.js";

import { rom_init, rom_draw } from "../app/rom.js";

if ( window.Worker ) {
	var worker = new Worker( "worker.js" );
	worker.postMessage( "ok ok ok" );
} else {

}

window.onblur = function( event ) {

};

import "../app.js";
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

function tab_list( el ) {
	this.el = el;
	this.tab = [];
	this.page = [];
	this.tab_active_i = 0;

	let self = this;

	function tab( el, i ) {
		this.el  = el;
		this.i   = i;

		if ( el.hasAttribute( "active" ) ) {
			self.tab_active_i = i;
		}
	}

	Array.from( el.children ).forEach( function( el, i ) {
		if ( i == self.el.children.length - 1 ) return;
		self.tab.push( new tab( el, i ) );

		el.addEventListener( "click", function( event ) {


		});
	});

	function page( el, i ) {
		this.el = el;
	}

	Array.from( el.parentNode.children ).forEach( function( el, i ) {
		if ( el.tagName == "PAGE" ) {
			self.page.push( new page( el, i ) );
		}
	});

	el.addEventListener( "click", function( event ) {
		if ( event.target.tagName == "A" ) {
			let i = Array.prototype.indexOf.call( event.target.parentNode.parentNode.children, event.target.parentNode );

			 if ( i < self.tab.length ) {
				self.tab[ self.tab_active_i ].el.removeAttribute( "active" );
				self.page[ self.tab_active_i ].el.removeAttribute( "active" );
				self.tab_active_i = i;
				self.tab[ self.tab_active_i ].el.setAttribute( "active", "" );
				self.page[ self.tab_active_i ].el.setAttribute( "active", "" );

			} else {

			}
		}
	});
}

new tab_list( document.getElementById( "side-tab" ) );
new tab_list( document.getElementById( "main-tab" ) );
new tab_list( document.getElementById( "tray-tab" ) );
