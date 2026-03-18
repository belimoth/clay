"use strict";

import { app } from "../main/app.js";

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

function cart_init() {
    app.nes.cart = {};

    app.nes.cart.rom = app.nes.rom;
    app.nes.cart.rom_data = app.nes.rom.rom_data;
    app.nes.cart.mapper = new mappers[ app.nes.rom.mapper ]( app.nes.rom );
}

function cart_bus_read( address ) {
    address = address - 0x8000;
    address = app.nes.cart.mapper.map( address );

    return app.nes.cart.rom_data[ address ];
};

function cart_bus_write( address, value ) {
    address = address - 0x8000;

    if ( app.nes.cart.mapper.bus_write ) {
        app.nes.cart.mapper.bus_write( address, value );
    }

    address = app.nes.cart.mapper.map( address );
    // TODO
    // app.nes.cart.rom_data[ address ] = value;
};

function nes_cart_chr_read( address ) {
    // TODO
};

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
        var slot_mode = ( this.registers[0] >> 2 ) & 1; // 0 = 0xC000 swaps 0x8000 page 0x00, 1 = 0x8000 swaps 0xC000 page 0x0F
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
                if ( address + 0x8000 < 0xC000 ) {
                    page = 0x00;
                } else {
                    page = prg_bank;
                    address = address - 0xC000
                }
            } else {
                if ( address + 0x8000 < 0xC000 ) {
                    page = prg_bank;
                } else {
                    page = rom.prg_banks - 1;
                    address = address - 0xC000
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
            case address + 0x8000 <= 0x8FFF : i = 0; break;
            case address + 0x8000 <= 0xAFFF : i = 1; break;
            case address + 0x8000 <= 0xCFFF : i = 2; break;
            case address + 0x8000 <= 0xEFFF : i = 3; break;
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

mappers[  4 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[  5 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[  7 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[  9 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 10 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 11 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 13 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 15 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 16 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 18 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 19 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 21 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 22 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 23 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 24 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 25 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 26 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 34 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 64 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 66 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 68 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 69 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 71 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 73 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 74 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 75 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 76 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 79 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 85 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 86 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[ 94 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[105 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[113 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[118 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[119 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[159 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[166 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[167 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[180 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[185 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[192 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[206 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[210 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[228 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}

mappers[232 ] = function( rom ) {
    this.map = function( address ) {
        return address;
    };
}



// 0	NROM
// 1	SxROM, MMC1
// 2	UxROM
// 3	CNROM
// 4	TxROM, MMC3, MMC6
// 5	ExROM, MMC5	Contains expansion sound
// 7	AxROM
// 9	PxROM, MMC2
// 10	FxROM, MMC4
// 11	Color Dreams
// 13	CPROM
// 15	100-in-1 Contra Function 16	Multicart
// 16	Bandai EPROM (24C02)
// 18	Jaleco SS8806
// 19	Namco 163	Contains expansion sound
// 21	VRC4a, VRC4c
// 22	VRC2a
// 23	VRC2b, VRC4e
// 24	VRC6a	Contains expansion sound
// 25	VRC4b, VRC4d
// 26	VRC6b	Contains expansion sound
// 34	BNROM, NINA-001
// 64	RAMBO-1	MMC3 clone with extra features
// 66	GxROM, MxROM
// 68	After Burner	ROM-based nametables
// 69	FME-7, Sunsoft 5B	The 5B is the FME-7 with expansion sound
// 71	Camerica/Codemasters	Similar to UNROM
// 73	VRC3
// 74	Pirate MMC3 derivative	Has both CHR ROM and CHR RAM (2k)
// 75	VRC1
// 76	Namco 109 variant
// 79	NINA-03/NINA-06	It's either 003 or 006, we don't know right now
// 85	VRC7	Contains expansion sound
// 86	JALECO-JF-13
// 94	Senjou no Ookami
// 105	NES-EVENT	Similar to MMC1
// 113	NINA-03/NINA-06??	For multicarts including mapper 79 games.
// 118	TxSROM, MMC3	MMC3 with independent mirroring control
// 119	TQROM, MMC3	Has both CHR ROM and CHR RAM
// 159	Bandai EPROM (24C01)
// 166	SUBOR
// 167	SUBOR
// 180	Crazy Climber	Variation of UNROM, fixed first bank at $8000
// 185	CNROM with protection diodes
// 192	Pirate MMC3 derivative	Has both CHR ROM and CHR RAM (4k)
// 206	DxROM, Namco 118 / MIMIC-1	Simplified MMC3 predecessor lacking some features
// 210	Namco 175 and 340	Namco 163 with different mirroring
// 228	Action 52
// 232	Camerica/Codemasters Quattro	Multicarts

let cart = {};
cart.init      = cart_init;
cart.bus_read  = cart_bus_read;
cart.bus_write = cart_bus_write;
export default cart;
