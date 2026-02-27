const INTERRUPT_NONE  = 0;
const INTERRUPT_IRQ   = 1;
const INTERRUPT_NMI   = 2;
const INTERRUPT_RESET = 3;

import { cpu   } from "/static/script/nes/cpu.js";
import { ppu   } from "/static/script/nes/ppu.js";
import { apu   } from "/static/script/nes/apu.js";
import { cart  } from "/static/script/nes/cart.js";
import { rom   } from "/static/script/nes/rom.js";
import { audio } from "/static/script/nes/audio.js";

import { update_pads           } from "/static/script/nes/apu.js";
import { render_crt            } from "/static/script/nes/render.js";
import { hex, base64_to_buffer } from "/static/script/nes/util.js";

export function nes() {
	this.frame = 0;

	this.wram = new Uint8Array( 0x0800 );
	this.save = new Uint8Array( 0x2000 ); // TODO

	this.cpu = new cpu();
	this.ppu  = new ppu();
	this.apu  = new apu();
	this.cart;
	this.audio;

	this.bus_read = function( address, peek = false ) {
		switch ( true ) {
			case ( address < 0x0800 ):
				return this.wram[ address ];

			case ( address < 0x2000 ):
				address = address & 0x07ff;
				return this.wram[ address ];

			case ( address < 0x4000 ):
				// address = ( address - 0x2000 ) % 8 + 0x2000; // TODO
				address = address & 0x2007;
			case ( address == 0x4014 ):
				return this.ppu.bus_read( address, peek );

			case ( address < 0x4020 ):
				return this.apu.bus_read( address, peek );

			case ( address < 0x6000 ):
				break;

			case ( address < 0x8000 ):
				return this.save[ address - 0x8000 ];

			default:
				return this.cart.bus_read( address, peek );
		}

		return 0;
	};

	this.bus_write = function( address, value ) {
		address = address & 0xffff;

		switch ( true ) {
			case ( address < 0x0800 ):
				this.wram[ address ] = value;
				break;

			case ( address < 0x2000 ):
				// address = address % 0x0800;
				address = address & 0x7ff;
				this.wram[ address ] = value;
				break;

			case ( address < 0x4000 ):
				address = ( address - 0x2000 ) % 8 + 0x2000;
				this.ppu.bus_write( address, value );
				break;

			case ( address == 0x4014 ):
				this.ppu.bus_write( address, value );
				break;

			case ( address < 0x4020 ):
				this.apu.bus_write( address, value );
				break;

			// case ( address < 0x8000 ):
			// 	// TODO
			// 	break;

			default:
				this.cart.bus_write( address, value );
		}

		return 0;
	};

	this.load_rom = function( key ) {
		var rom_text   = app.storage.roms[ key ];
		var rom_buffer = base64_to_buffer( rom_text );

		console.log( "MD5", SparkMD5.ArrayBuffer.hash( rom_buffer.slice(16) ) );

		this.cart = new cart( new rom( rom_buffer ) );

		function get_2( i ) {
			return ( app.nes.bus_read( i + 1 ) << 8 ) | app.nes.bus_read( i );
		}

		var vector_nmi   = get_2( 0xfffa );
		var vector_reset = get_2( 0xfffc );
		var vector_brk   = get_2( 0xfffe );

		console.log( "nmi: "   + hex( vector_nmi  , 4 ) );
		console.log( "reset: " + hex( vector_reset, 4 ) );
		console.log( "brk: "   + hex( vector_brk  , 4 ) );

		this.cpu.start();
		this.cpu.pc = vector_reset;
	};

	const vblank_start = 27166;
	const vblank_end   = 29780;

	this.emulate = function() {
		// app.cycles_start = app.nes.cpu.cycles;
		app.cycles_start = app.nes.cpu.cycles - ( app.nes.cpu.cycles % vblank_end );

		var cycles_previous = 0;

		app.nes.ppu.start_frame();

		var cycles_current = app.nes.cpu.cycles - app.cycles_start;

		var target = vblank_start;

		do {
			cycles_current = app.nes.cpu.cycles - app.cycles_start;
			app.nes.cpu.step();

			if ( cycles_previous < target && cycles_current >= target ) {
				app.nes.ppu.in_vblank = 1;
			}

			if ( cycles_previous < target + 7 && cycles_current >= target + 7 ) {
				var nmi_enabled = ( app.nes.ppu.control >> 7 ) & 1;

				if ( nmi_enabled == 1 ) {
					app.nes.cpu.interrupt_pending = INTERRUPT_NMI;
				}
			}

			cycles_previous = cycles_current;
		} while ( cycles_current < vblank_end );
	};

	this.play = function() {
		// var dump = "";

		// for ( var i = 0; i <= 0xffff; i += 1 ) {
		// 	if ( i % 16 == 0 ) {
		// 		dump = dump + "\n" + hex( i, 4 ) + "  ";
		// 	}

		// 	if ( i % 16 == 8 ) {
		// 		dump = dump + " ";
		// 	}

		// 	dump = dump + hex( app.nes.bus_read( i ), 2 ) + " ";


		// }

		// console.log( dump );

		// return;

		function main() {
			app.nes.emulate();
			render_crt();
			app.audio.update_fixed();
			app.nes.frame = app.nes.frame + 1;
		}

		var timePrevious = window.performance.now(), timeElapsed;
		var timePreviousReal = window.performance.now(), timeElapsedReal;

		// TODO research setting timer precision in electron build

		// /*
		const interval = 1000 / 60;
		/*/
		const interval = 100;
		//*/

		function loop( timeCurrent ) {
			if ( app.nes.frame == 1 && false ) {

			} else {
				window.requestAnimationFrame( loop );
			}

			timeElapsed = timeCurrent - timePrevious;

			if ( timeElapsed >= interval ) {
				update_pads();
				main();

				timeElapsedReal = timeCurrent - timePreviousReal;
				fps_buffer[ fps_i ] = timeElapsedReal;
				render_fps_buffer();
				fps_i = ( fps_i + 1 ) % ( 1024 / 4 );

				timePrevious = timeCurrent - ( timeElapsed % interval );
				timePreviousReal = timeCurrent;
			}
		}

		var el_fps = document.getElementById( "fps" );

		setInterval(function(){
			el_fps.innerHTML = ( 1000 / timeElapsedReal ).toFixed( 1 ).padStart( 5, " " ) + " FPS";
		}, 500 );

		app.audio = new audio();

		window.requestAnimationFrame( loop );
	};
}

var fps_buffer = new Float32Array( 256 );
var fps_i = 0;
var canvas_fps = document.getElementById( "monitor-fps" );
var context_fps = canvas_fps.getContext( "2d" );

function render_fps_buffer() {
    context_fps.fillStyle = "#FFFFFF";

    var x = fps_i;

    // for ( var x = 0; x < 1024; x += 1 ) {
        // var y = ( fps_buffer[ x ] - 800 ) * 128 / 1600;
        var y = fps_buffer[ x ];
        context_fps.clearRect( x * 4, 0, 4 * 2, 256 );
        // context_fps.fillRect( x * 4, y, 4, 1 );
        context_fps.fillRect( x * 4, y, 4, 256 - y );
        // console.log( fps_buffer[ fps_i ], y );
    // }

    // TDO
    // var imageData = context.createImageData( 1, 128 );
}
