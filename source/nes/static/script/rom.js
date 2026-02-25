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

"use strict";

export function rom( rom_buffer ) {
    var nes_data = new Uint8Array( rom_buffer, 0, 16 );

    var data = nes_data;

    // assert data[0-3] == 0x4e45531a

    this.prg_banks = data[4];
    this.chr_banks = data[5];

    this.mirroring   = ( data[6] >> 0 ) & 1;
    
    this.four_screen = ( data[6] >> 3 ) & 1;
    this.has_battery = ( data[6] >> 1 ) & 1;
    this.has_trainer = ( data[6] >> 2 ) & 1;
    this.arcade      = ( data[7] >> 0 ) & 3;
    this.is_nes_2    = ( ( data[7] >> 2 ) & 3 ) == 2 ? 1 : 0;

    this.mapper = ( data[6] >> 4 ) | ( data[7] & 0xf0 );
    this.submapper = 0;

    if ( this.is_nes_2 ) {
        this.mapper = this.mapper | ( ( data[8] & 0b1111 ) << 8 );

        this.chr_banks = this.chr_banks | ( ( data[ 9 ] & 0xf0 ) << 0 );
        this.prg_banks = this.prg_banks | ( ( data[ 9 ] & 0x0f ) << 4 );

        this.chr_banks = this.chr_banks | ( ( data[ 9 ] & 0xf0 ) << 0 );
        
        this.prg_ram_size   = 64 << ( ( data[ 10 ] >> 4 ) & 0x0f );
        this.prg_nvram_size = 64 << ( ( data[ 10 ] >> 0 ) & 0x0f );

        this.chr_ram_size   = 64 << ( ( data[ 11 ] >> 4 ) & 0x0f );
        this.chr_nvram_size = 64 << ( ( data[ 11 ] >> 0 ) & 0x0f );

        console.log( data[10].toString( 2 ) );
    }

    this.info = function() {
        console.log( "NES 2.0: " + [ "no", "yes" ][ this.is_nes_2 ] );

        console.log( "PRG size: "    + ( this.prg_banks * 16 + "" ).padStart( 2, " " ) + " KiB" );
        console.log( "CHR size: "    + ( this.chr_banks *  8 + "" ).padStart( 2, " " ) + " KiB" );

        console.log( "PRG RAM:   " + this.prg_ram_size   + " bytes" );
        console.log( "PRG NVRAM: " + this.prg_nvram_size + " bytes" );

        console.log( "CHR RAM:   " + this.chr_ram_size   + " bytes" );
        console.log( "CHR NVRAM: " + this.chr_nvram_size + " bytes" );

        console.log( "mirroring: "      + mirror_names[ this.mirroring ] );

        console.log( "battery: "     + [ "no", "yes" ][ this.has_battery ] );
        console.log( "trainer: "     + [ "no", "yes" ][ this.has_trainer ] );
        console.log( "mapper: "      + mapper_names[ this.mapper ] + " (" + ( this.mapper + "" ).padStart( 3, "0" ) + ")" );
        console.log( "submapper: (" + this.submapper + ")" );   

        var el = document.getElementById( "dl-rom-info" );

        function add_fact( key, value ) {
            var dt = document.createElement( "dt" );
            var dd = document.createElement( "dd" );
            dt.innerHTML = key;
            dd.innerHTML = value;
            el.appendChild( dt );
            el.appendChild( dd );
        }

        add_fact(
            "Mapper", mapper_names[ this.mapper ]
        );
    };


    this.info();


    this.prg_size = this.prg_banks * 0x4000;
    this.chr_size = this.chr_banks * 0x2000;

    this.rom_data = new Uint8Array( rom_buffer, 16                , this.prg_size );
    this.chr_data = new Uint8Array( rom_buffer, 16 + this.prg_size );//, this.chr_size );

    // TEMP
    // this.chr_data = new Uint8Array( 0x2000 );
    
    // REALLY GOOD DONKEY KONG CORRUPTION
    if ( false ) {
        // this.chr_size = 0x2000;
        this.chr_data = new Uint8Array( rom_buffer, 16 + 0x3800 )
    }
}