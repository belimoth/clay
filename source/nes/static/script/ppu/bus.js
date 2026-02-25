export function ppu_bus() {
    this.bus_read = function( address, peek = false ) {
        switch( address ) {
            // case 0x2000: return this.control;
            // case 0x2001: return this.mask;
            case 0x2002: return this.read_status();
            // case 0x2003: return this.oam_address;
            case 0x2004: return this.oam[ this.oam_address ];
            // case 0x2006: return this.read_vram_address();
            case 0x2007: return this.read_vram_data();
        }

        return 0;
    };

    this.bus_write = function( address, value ) {
        if ( app.nes.frames < 1 ) { return; }
        this.garbage = value & 0b00011111;

        switch( address ) {
            case 0x2000: this.control = value;             break;
            case 0x2001: this.mask = value;                break;
            case 0x2002: break;
            case 0x2003: this.oam_address = value;         break;
            case 0x2004: this.write_oam_address( value );  break;
            case 0x2005: this.write_scroll( value );       break;
            case 0x2006: this.write_vram_address( value ); break;
            case 0x2007: this.write_vram_data( value );    break;
            case 0x4014: this.oam_dma( value );            break;
        }

        return 0;
    };
}