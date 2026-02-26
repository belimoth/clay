"use strict";

export function ppu_status() {
    this.in_vblank       = 0;
    this.sprite_zero_hit = 0;
    this.sprite_overflow = 0;

    this.sprite_zero_test = function() {
        var result = 0;

        var [ ppu_x, ppu_y ] = this.get_xy();

        var sprite_zero_y = app.nes.ppu.oam[ 0 * 4 + 0 ];
        var sprite_zero_x = app.nes.ppu.oam[ 0 * 4 + 3 ];

        if (
            ppu_x >= sprite_zero_x &&
            ppu_y >= sprite_zero_y &&
            sprite_zero_x >=   0 &&
            sprite_zero_x <= 255 &&
            sprite_zero_y >=   1 &&
            sprite_zero_y <= 239
        ) {
            result = 1;
        }

        if (
            ppu_y == 1 ||
            this.mask & 0b00011000 != 0 ||
            ( this.mask & 0b00000011 != 3 && ppu_x <= 7 ) ||
            ppu_x == 255
        ){
            result = 0;
        }

        return result;
    };

    this.read_status = function() {
        // console.log( hex( this.t, 4 ) + " " + hex( this.v, 4 ) + " " + hex( this.w, 1 ) + " status read" );

        this.sprite_zero_hit = this.sprite_zero_test();

        var status = (
            ( this.in_vblank       << 7 ) |
            ( this.sprite_zero_hit << 6 ) |
            ( this.sprite_overflow << 5 ) |
            this.garbage
        );

        this.in_vblank = 0;
        this.latch = 0;
        this.w = 0;

        return status;
    };
}
