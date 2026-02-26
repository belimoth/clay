"use strict";

export function ppu_data() {
    // this.vram_address  = [ 0, 0 ];
    this.vram_data = 0;

    this.write_vram_address = function( value ) {
        // console.log( window.text_for_instruction( app.nes.cpu.instruction ) + " " + hex( app.nes.cpu.pc, 4 ) + " : " + hex( this.t, 4 ) + " " + hex( this.v, 4 ) + " " + hex( this.w, 1 ) + " address write" );

        if ( this.w == 0 ) {
            this.t = ( this.t & 0x00ff ) | ( ( value << 8 ) & 0x3f00 );
            this.w = 1;
        } else {
            this.t = ( this.t & 0xff00 ) | ( ( value      ) & 0x00ff );
            this.v = this.t;
            this.w = 0;
        }

        // this.vram_address[ this.latch ] = value & 0xff;

        // var address = ( this.vram_address[ 0 ] << 8 ) | this.vram_address[ 1 ];
        // address = address & 0x7fff;
        // this.vram_address[1] = ( address >> 0 ) & 0xff;
        // this.vram_address[0] = ( address >> 8 ) & 0xff;

        // this.latch = 1 - this.latch;
    };

    this.increment_vram_address = function() {
        this.v = this.v + [ 1, 32 ][ ( this.control >> 2 ) & 1 ];
        return;

        // var address = ( this.vram_address[ 0 ] << 8 ) | this.vram_address[ 1 ];
        // var increment = ( this.control >> 2 ) & 1;
        // address = address + [ 1, 32 ][ increment ];
        // address = address & 0x7fff;
        // this.vram_address[1] = ( address >> 0 ) & 0xff;
        // this.vram_address[0] = ( address >> 8 ) & 0xff;
    }

    this.read_vram_data = function( peek ) {

        // console.trace();
        // console.log( window.text_for_instruction( app.nes.cpu.instruction ) + " " + hex( app.nes.cpu.pc, 4 ) + " : " + hex( this.t, 4 ) + " " + hex( this.v, 4 ) + " " + hex( this.w, 1 ) + " data read" );

        var result = this.vram_data;
        var address = this.v;

        // if ( ! peek ) {
            this.vram_data = this.read_vram( address );
        // }

        if ( address >= 0x3f00 && address <= 0x3fff ) {
            address = ( ( address - 0x3f00 ) & 0x1f ) + 0x3f00;
            return this.read_vram( address );
        }

        // if ( ! peek ) { this.increment_vram_address(); }
        return result

        // if ( ( this.mask >> 3 ) & 0b11 != 0 ) { throw "data access during rendering"; }

        var address = ( ( this.vram_address[ 0 ] << 8 ) | this.vram_address[ 1 ] ) & 0x3fff;

        // console.log( "ppu vram data read @ " + hex( address, 4 ) );

        var temp = this.vram_data;
        this.vram_data = this.read_vram( address );

        if ( address >= 0x3f00 && address <= 0x3fff ) {
            address = ( ( address - 0x3f00 ) & 0x1f ) + 0x3f00;
            temp = this.read_vram( address );
        }

        this.increment_vram_address();

        return temp;
    };

    this.write_vram_data = function( value ) {
        // console.trace();
        // console.log( window.text_for_instruction( app.nes.cpu.instruction ) + " " + hex( app.nes.cpu.pc, 4 ) + " : " + hex( this.t, 4 ) + " " + hex( this.v, 4 ) + " " + hex( this.w, 1 ) + " data write" );

        // if ( ( this.mask >> 3 ) & 0b11 != 0 ) { throw "data access during rendering"; }

        // var address = ( ( this.vram_address[ 0 ] << 8 ) | this.vram_address[ 1 ] ) & 0x3fff;

        this.write_vram( this.v, value );

        if ( this.v >= 0x3F00 && this.v < 0x3F20 ) {
            this.render_chr = true;
        }

        this.increment_vram_address();
    };
}
