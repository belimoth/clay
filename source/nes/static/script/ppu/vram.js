export function ppu_vram() {
    // this.vram = new Uint8Array( 0x4000 );

    this.vram_nametable_a = new Uint8Array( 0x400 );
    this.mask_nametable_a = new Uint8Array( 0x400 );

    this.vram_nametable_b = new Uint8Array( 0x400 );
    this.mask_nametable_b = new Uint8Array( 0x400 );

    this.vram_palettes    = new Uint8Array( 0x100  );
    this.mask_palettes    = new Uint8Array( 0x100  );

    this.map_address = function( address ) {
        if ( address >= 0x2000 && address < 0x3000 ) {
            var address_relative = ( address - 0x2000 ) % 0x400;
            var nt = ( ( address - 0x2000 ) - address_relative ) / 0x400;

            if ( app.nes.cart.rom.mirroring == 0 ) {
                nt = [ 0, 0, 1, 1 ][ nt ];
            } else {
                nt = [ 0, 1, 0, 1 ][ nt ];
            }

            address = 0x2000 + 0x400 * nt + address_relative;
        }

        return address;
    };

    this.read_vram = function( address ) {;
        switch ( true ) {
            case address < 0x2000 : return app.nes.cart.rom.chr_data[ address ];
            case address < 0x2400 : return this.vram_nametable_a[ address - 0x2000 ];
            case address < 0x2800 : return this.vram_nametable_b[ address - 0x2400 ];
            case address < 0x2C00 : return this.vram_nametable_a[ address - 0x2800 ];
            case address < 0x3000 : return this.vram_nametable_b[ address - 0x2c00 ];
            case address < 0x3F00 : break;
            case address < 0x4000 : return this.vram_palettes[ address - 0x3F00 ];
        }
        
        return 0;
    };

    this.write_to_nametable = function ( i, address, value ) {
        var vram, mask

        switch ( i ) {
            case 0 :
                vram = this.vram_nametable_a;
                mask = this.mask_nametable_a;
                break;
            case 1 :
                if ( app.nes.cart.rom.mirroring == 0 ) {
                    vram = this.vram_nametable_a;
                    mask = this.mask_nametable_a;
                } else {
                    vram = this.vram_nametable_b;
                    mask = this.mask_nametable_b;
                }
                break;
            case 2 :
                if ( app.nes.cart.rom.mirroring == 0 ) {
                    vram = this.vram_nametable_b;
                    mask = this.mask_nametable_b;
                } else {
                    vram = this.vram_nametable_a;
                    mask = this.mask_nametable_a;
                }
                break;
            case 3 :
                vram = this.vram_nametable_a;
                mask = this.mask_nametable_a;
                break;
        }

        vram[ address ] = value;
        mask[ address ] = 1;
    }

    this.write_vram = function( address, value ) {
        if ( address >= 0x3000 && address <= 0x3eff ) {
            address = address - 0x1000;
        }

        switch ( true ) {
            case address < 0x2000 : app.nes.cart.rom.chr_data[ address ] = value; break; // NOTE
            case address < 0x2400 : this.write_to_nametable( 0, address - 0x2000, value ); break;
            case address < 0x2800 : this.write_to_nametable( 1, address - 0x2400, value ); break;
            case address < 0x2C00 : this.write_to_nametable( 2, address - 0x2800, value ); break;
            case address < 0x3000 : this.write_to_nametable( 3, address - 0x2c00, value ); break;
            case address < 0x3F00 : break;
            case address < 0x3F20 :
                this.vram_palettes[ address - 0x3F00 ] = value;
                this.mask_palettes[ address - 0x3F00 ] = value;
                this.render_chr = true;
                break;
            case address < 0x4000 :
                address = ( ( address - 0x3f20 ) & 0x1f ) + 0x3f20;
                this.vram_palettes[ address - 0x3F00 ] = value;
                this.mask_palettes[ address - 0x3F00 ] = value;
                this.render_chr = true;
                break;
        }
        
        return 0;
    };
}