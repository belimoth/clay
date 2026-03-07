const INTERRUPT_NONE  = 0;
const INTERRUPT_IRQ   = 1;
const INTERRUPT_NMI   = 2;
const INTERRUPT_RESET = 3;

import { cpu }             from "./cpu.js";
import { ppu }             from "./ppu.js";
import { apu }             from "./apu.js";
import { default as cart } from "./cart.js";
import { default as rom  } from "./rom.js";
import { audio }           from "./audio.js";

import { update_pads           } from "./apu.js";
import { render_crt            } from "./render.js";
import { hex, base64_to_buffer } from "./util.js";

function nes_init() {
	app.nes = {};

	app.nes.frame = 0;

	app.nes.wram = new Uint8Array( 0x0800 );
	app.nes.save = new Uint8Array( 0x2000 ); // TODO

	app.nes.cpu = new cpu();
	app.nes.ppu = new ppu();
	app.nes.apu = new apu();
	app.nes.cart;
	app.nes.audio;

	app.nes.loop = null;
}

function nes_bus_read( address, peek = false ) {
	switch ( true ) {
		case ( address < 0x0800 ):
		return app.nes.wram[ address ];

		case ( address < 0x2000 ):
		address = address & 0x07ff;
		return app.nes.wram[ address ];

		case ( address < 0x4000 ):
		// address = ( address - 0x2000 ) % 8 + 0x2000; // TODO
		address = address & 0x2007;
		case ( address == 0x4014 ):
		return app.nes.ppu.bus_read( address, peek );

		case ( address < 0x4020 ):
		return app.nes.apu.bus_read( address, peek );

		case ( address < 0x6000 ):
		break;

		case ( address < 0x8000 ):
		return app.nes.save[ address - 0x8000 ];

		default:
		return cart.bus_read( address, peek );
	}

	return 0;
};

function nes_bus_write( address, value ) {
	address = address & 0xffff;

	switch ( true ) {
		case ( address < 0x0800 ):
		app.nes.wram[ address ] = value;
		break;

		case ( address < 0x2000 ):
		// address = address % 0x0800;
		address = address & 0x7ff;
		app.nes.wram[ address ] = value;
		break;

		case ( address < 0x4000 ):
		address = ( address - 0x2000 ) % 8 + 0x2000;
		app.nes.ppu.bus_write( address, value );
		break;

		case ( address == 0x4014 ):
		app.nes.ppu.bus_write( address, value );
		break;

		case ( address < 0x4020 ):
		app.nes.apu.bus_write( address, value );
		break;

		// case ( address < 0x8000 ):
		// // TODO
		// break;

		default:
		cart.bus_write( address, value );
	}

	return 0;
};

function nes_load( key ) {
	var rom_text   = app.storage.rom[ key ];
	var rom_buffer = base64_to_buffer( rom_text );

	rom.init( rom_buffer );
	app.nes.rom.hash = SparkMD5.ArrayBuffer.hash( rom_buffer.slice(16) );
	cart.init( app.nes.rom );

	function get_2( i ) {
		return ( nes_bus_read( i + 1 ) << 8 ) | nes_bus_read( i );
	}

	var vector_nmi   = get_2( 0xFFFA );
	var vector_reset = get_2( 0xFFFC );
	var vector_brk   = get_2( 0xFFFE );

	// console.log( "nmi: "   + hex( vector_nmi  , 4 ) );
	// console.log( "reset: " + hex( vector_reset, 4 ) );
	// console.log( "brk: "   + hex( vector_brk  , 4 ) );

	app.nes.cpu.start();
	app.nes.cpu.pc = vector_reset;

}

function nes_step() {
	const vblank_start = 27166;
	const vblank_end   = 29780;

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
}


function nes_play() {
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
		nes.step();
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
			app.nes.loop = window.requestAnimationFrame( loop );
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

	app.nes.loop = window.requestAnimationFrame( loop );
}

function nes_stop() {
		window.cancelAnimationFrame( app.nes.loop );
}

let nes = {};
nes.init      = nes_init;
nes.bus_read  = nes_bus_read;
nes.bus_write = nes_bus_write;
nes.load      = nes_load;
nes.step      = nes_step;
nes.play      = nes_play;
nes.stop      = nes_stop;

export default nes;





























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
