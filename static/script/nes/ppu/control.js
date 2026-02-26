"use strict";

export function ppu_control() {
    this.control = 0;

    // this.nmi_enable     = 0;
    // this.ppu_ext_mode   = 0;
    // this.sprite_height  = 0;
    // this.bg_tile_select = 0;
    // this.fg_tile_select = 0;
    // this.increment_mode = 0;
    // this.nt_select      = 0;

    this.write_control = function( value ) {
        // console.log( hex( this.t, 4 ) + " " + hex( this.v, 4 ) + " " + hex( this.w, 1 ) + " control write" );
        this.control = value;
        // this.t = ( this.t & 0x73ff ) | ( ( value & 0x03 ) << 10 );
    }
}
