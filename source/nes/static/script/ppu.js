import { ppu_vram    } from "/static/script/ppu/vram.js";
import { ppu_oam     } from "/static/script/ppu/oam.js";

import { ppu_control } from "/static/script/ppu/control.js";
import { ppu_mask    } from "/static/script/ppu/mask.js";
import { ppu_status  } from "/static/script/ppu/status.js";

import { ppu_scroll  } from "/static/script/ppu/scroll.js";
import { ppu_data    } from "/static/script/ppu/data.js";

import { ppu_bus     } from "/static/script/ppu/bus.js";

export function ppu() {
    this.latch = 0;

    ppu_vram   .call( this );
    ppu_oam    .call( this );

    this.t = 0;
    this.v = 0;
    this.w = 0;
    this.x = 0;

    ppu_control.call( this );
    ppu_mask   .call( this );
    ppu_status .call( this );

    ppu_scroll .call( this );
    ppu_data   .call( this );

    ppu_bus    .call( this );

    this.render_chr = false;

    this.splits = [];
    this.scroll_x = 0;

    this.push_split = function( skip ) {
        var [ ppu_x, ppu_y ] = this.get_xy();
        var nt_x = ( this.control >> 0 ) & 1;
        var nt_y = ( this.control >> 1 ) & 1;

        if ( ppu_y >= 239 ) {

        } else {
            // this.splits.push({
            //     y : undefined,
            //     scroll_x : this.scroll[0] + nt_x * 256,
            //     nt_y : nt_y * 240,
            // });

            this.splits[ ppu_y ] =  this.scroll_x;
        }


        this.scroll_x = this.scroll[0] + nt_x * 256;
    };

    this.start_frame = function() {
        var nt_x = ( this.control >> 0 ) & 1;
        var nt_y = ( this.control >> 1 ) & 1;

        this.splits = [];

        // this.splits[0] = this.scroll[0] + nt_x * 256;

        // this.splits = [{
        //     y : undefined,
        //     scroll_x : this.scroll[0] + nt_x * 256,
        // }];

        this.in_vblank = 0;
    };

    this.get_xy = function() {
        var ppu_cycles = ( app.nes.cpu.cycles - app.cycles_start ) * 3;

        var ppu_x = ppu_cycles % 341;
        var ppu_y = ( ( ppu_cycles - ppu_x ) / 341 ) % 262;

        return [ ppu_x, ppu_y ];
    };
}
