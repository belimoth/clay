"use strict";

function mask_bits( value, mask ) {
    if ( mask == 0 ) { return; }
    // position of rightmst set bit
    var t = Math.log2( mask & ( ~ mask + 1 ) );
    return ( value & mask ) >> t;
}

function bit_mask( mask ) {
    if ( mask == 0 ) { return; }
    const t = Math.log2( mask & ( ~ mask + 1 ) );

    return function( value ) {
        return ( value & mask ) >> t;
    };
}

export function cart( rom ) {
    this.rom = rom;
    this.rom_data = rom.rom_data;
    this.mapper = new mappers[ rom.mapper ]( rom );

    this.bus_read = function( address ) {
        address = address - 0x8000;
        address = this.mapper.map( address );

        return this.rom_data[ address ];
    };

    this.bus_write = function( address, value ) {
        address = address - 0x8000;

        if ( this.mapper.bus_write ) {
            this.mapper.bus_write( address, value );
        }

        address = this.mapper.map( address );
        // TODO
        // this.rom_data[ address ] = value;
    };

    this.chr_read = function( address ) {
        // TODO
    };
}

var mappers = {};

mappers[ 0 ] = function( rom ) {
    // for 16KiB NROM this wrapping
    // if ( address >= 0xC000 ) { address = address - 0x4000; }
    // can be expressed as this
    // address = address & 0x3fff;
    // etc

    this.mask = rom.prg_size - 1;

    this.map = function( address ) {
        return address & this.mask;
    };
};

mappers[ 1 ] = function( rom ) {
    this.t = 0;
    this.w = 0;

    this.registers = [ 0, 0, 0, 0 ];

    this.registers[ 0 ] = 0b00001100;

    this.map = function( address ) {
        var chr_mode  = ( this.registers[0] >> 4 ) & 1; // 0 =  8k, 1 =  4k
        var prg_mode  = ( this.registers[0] >> 3 ) & 1; // 0 = 32k, 1 = 16k
        var slot_mode = ( this.registers[0] >> 2 ) & 1; // 0 = 0xc000 swaps 0x8000 page 0x00, 1 = 0x8000 swaps 0xc000 page 0x0f
        var mirroring = ( this.registers[0] >> 0 ) & 3; // 0 = aaaa, 1 = bbbb, 2 = abab, 3 = aabb

        var chr_bank_0 = this.registers[1] & 0b11111;
        var chr_bank_1 = this.registers[2] & 0b11111;

        var wram_disable = ( this.registers[3] >> 4 ) & 1;
        var prg_bank = this.registers[3] & 0b01111;

        if ( prg_mode == 0 ) {
            address = prg_bank * 0x8000;
        } else {
            var page = 0;

            if ( slot_mode == 0 ) {
                if ( address + 0x8000 < 0xc000 ) {
                    page = 0x00;
                } else {
                    page = prg_bank;
                    address = address - 0xc000
                }
            } else {
                if ( address + 0x8000 < 0xc000 ) {
                    page = prg_bank;
                } else {
                    page = rom.prg_banks - 1;
                    address = address - 0xc000
                }
            }

            address = address + page * 0x4000;
        }

        return address;
    };

    this.bus_write = function( address, value ) {
        var reset = ( value >> 7 ) & 1;
        var data  = ( value >> 0 ) & 1;

        var i = 0;

        // TODO use bitmask instead to determine register

        switch ( true ) {
            case address + 0x8000 <= 0x8fff : i = 0; break;
            case address + 0x8000 <= 0xafff : i = 1; break;
            case address + 0x8000 <= 0xcfff : i = 2; break;
            case address + 0x8000 <= 0xefff : i = 3; break;
            default: throw "panic " + hex( address, 4 );
        }

        if ( reset == 1 ) {
            // reset register
            this.registers[i] = 0;

            // write ....11.. to 0x8000
            this.registers[0] = this.registers[0] | 0b00001100;

            this.w = 0;
        } else {
            this.t = this.t | ( data << this.w );
            this.w = ( this.w + 1 ) % 5;

            if ( this.w == 0 ) {
                console.log( "register " + i + " = " + this.t );
                this.registers[i] = this.t;
                this.t = 0;
            }
        }
    };
};

mappers[ 2 ] = function( rom ) {
    this.bank = 0;

    this.map = function( address ) {
        var bank;

        if ( address < 0x4000 ) {
            bank = this.bank;
        } else {
            address = address - 0x4000
            bank = rom.prg_banks - 1;
        }

        // throw hex( address + 0x8000, 4 ) + " " + hex( address - 0x4000 + bank * 0x4000 );

        return address + bank * 0x4000;
    };

    this.bus_write = function( address, value ) {
        this.bank = value;
    };
};

mappers[ 3 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };

    this.bus_write = function( address, value ) {
        // TODO
    };
};
