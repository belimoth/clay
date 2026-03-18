"use strict";

import { app } from "../main/app.js";

var mirror_names = [ "horizontal", "vertical" ];
var mapper_names = [ "NROM", "MMC1", "UxROM", "CNROM", "MMC", "MMC", "AxROM", "MMC2", "MMC4" ];

var screen_layouts = [
	"AABB", // 32 x 60 horizontal mirroring
	"ABAB", // 64 x 30 vertical mirroring
	"ABCD", // 64 x 60 four-screen
	"AAAA", // 32 x 30 single-screen
	"ABBA", // diagonal mirroring
	"ABBB", // L-shaped mirroring
	"ABCC", // three-screen horizontal
	"ABBC", // three-screen diagonal
];

function rom_init( rom_buffer ) {
	let nes_data = new Uint8Array( rom_buffer, 0, 16 );
	let data = nes_data;

	// assert data[0-3] == 0x4e45531a

	app.nes.rom = {};

	app.nes.rom.prg_banks = data[4];
	app.nes.rom.chr_banks = data[5];

	app.nes.rom.mirroring   = ( data[6] >> 0 ) & 1;

	app.nes.rom.four_screen = ( data[6] >> 3 ) & 1;
	app.nes.rom.has_battery = ( data[6] >> 1 ) & 1;
	app.nes.rom.has_trainer = ( data[6] >> 2 ) & 1;
	app.nes.rom.arcade      = ( data[7] >> 0 ) & 3;
	app.nes.rom.is_nes_2    = ( ( data[7] >> 2 ) & 3 ) == 2 ? 1 : 0;

	app.nes.rom.mapper = ( data[6] >> 4 ) | ( data[7] & 0xf0 );
	app.nes.rom.submapper = 0;

	if ( app.nes.rom.is_nes_2 ) {
		app.nes.rom.mapper = app.nes.rom.mapper | ( ( data[8] & 0b1111 ) << 8 );

		app.nes.rom.chr_banks = app.nes.rom.chr_banks | ( ( data[ 9 ] & 0xf0 ) << 0 );
		app.nes.rom.prg_banks = app.nes.rom.prg_banks | ( ( data[ 9 ] & 0x0f ) << 4 );

		app.nes.rom.chr_banks = app.nes.rom.chr_banks | ( ( data[ 9 ] & 0xf0 ) << 0 );

		app.nes.rom.prg_ram_size   = 64 << ( ( data[ 10 ] >> 4 ) & 0x0f );
		app.nes.rom.prg_nvram_size = 64 << ( ( data[ 10 ] >> 0 ) & 0x0f );

		app.nes.rom.chr_ram_size   = 64 << ( ( data[ 11 ] >> 4 ) & 0x0f );
		app.nes.rom.chr_nvram_size = 64 << ( ( data[ 11 ] >> 0 ) & 0x0f );

		// console.log( data[10].toString( 2 ) );
	} else {
		app.nes.rom.prg_ram_size   = 0;
		app.nes.rom.prg_nvram_size = 0;
		app.nes.rom.chr_ram_size   = 0;
		app.nes.rom.chr_nvram_size = 0;
	}

	rom_info_draw();

	app.nes.rom.prg_size = app.nes.rom.prg_banks * 0x4000;
	app.nes.rom.chr_size = app.nes.rom.chr_banks * 0x2000;

	app.nes.rom.rom_data = new Uint8Array( rom_buffer, 16, app.nes.rom.prg_size );
	app.nes.rom.chr_data = new Uint8Array( rom_buffer, 16 + app.nes.rom.prg_size );//, app.nes.rom.chr_size );

	// REALLY GOOD DONKEY KONG CORRUPTION
	if ( false ) { app.nes.rom.chr_data = new Uint8Array( rom_buffer, 16 + 0x3800 ) }
}

function rom_info_draw() {
	var el = document.getElementById( "rom-info" );

	el.innerHTML = "";

	function add_fact( key, value ) {
		var dt = document.createElement( "dt" );
		var dd = document.createElement( "dd" );
		dt.innerHTML = key;
		dd.innerHTML = value;
		el.appendChild( dt );
		el.appendChild( dd );
	}

	add_fact( "NES 2.0",   [ "no", "yes" ][ app.nes.rom.is_nes_2 ] );
	add_fact( "PRG size",  ( app.nes.rom.prg_banks * 16 + "" ).padStart( 2, " " ) + " KiB" );
	add_fact( "CHR size",  ( app.nes.rom.chr_banks *  8 + "" ).padStart( 2, " " ) + " KiB" );
	add_fact( "PRG RAM",   app.nes.rom.prg_ram_size   + " B" );
	add_fact( "PRG NVRAM", app.nes.rom.prg_nvram_size + " B" );
	add_fact( "CHR RAM",   app.nes.rom.chr_ram_size   + " B" );
	add_fact( "CHR NVRAM", app.nes.rom.chr_nvram_size + " B" );
	add_fact( "Mirroring", mirror_names[ app.nes.rom.mirroring ] );
	add_fact( "Battery",   [ "no", "yes" ][ app.nes.rom.has_battery ] );
	add_fact( "Trainer",   [ "no", "yes" ][ app.nes.rom.has_trainer ] );
	add_fact( "Mapper",    mapper_names[ app.nes.rom.mapper ] + " (" + ( app.nes.rom.mapper + "" ).padStart( 3, "0" ) + ")" );
	add_fact( "Submapper", app.nes.rom.submapper );
};

let rom = {};
rom.init      = rom_init;
rom.info_draw = rom_info_draw;
export default rom;
