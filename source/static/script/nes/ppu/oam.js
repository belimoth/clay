"use strict";

export function ppu_oam() {
    this.oam  = new Uint8Array( 0x0100 );

    this.oam_address = 0;

    this.write_oam_address = function( value ) {
        this.oam[ this.oam_address ] = value;
        this.oam_address += 1;
    };

    this.oam_dma = function( value ) {
        for ( var i = 0; i < 0x100; i += 1 ) {
            this.oam[ ( this.oam_address + i ) & 0x00ff ] = app.nes.wram[ ( value << 8 ) + i ]
        }

        app.nes.cpu.cycles += 513;
    };
}
