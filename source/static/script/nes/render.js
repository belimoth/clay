"use strict";

const SCALE = 4;

const RENDER_TEST = false;

import { nes_palette } from "/static/script/nes/palette.js";

function get_context_for_canvas( canvas, options = null ) {
    var context = canvas.getContext( "2d", options );
    context.imageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
    return context;
}

function get_context_for_id( id, options = null ) {
    var canvas = document.getElementById( id );
    return [ canvas, get_context_for_canvas( canvas, options ) ];
}

function make_canvas( width, height, options ) {
    var canvas = document.createElement( "canvas" );
    canvas.width = width;
    canvas.height = height;
    var context = get_context_for_canvas( canvas, options );
    return [ canvas, context ];
}


// var [ canvas_chr, context_chr ] = make_canvas( 1024, 256, { alpha : false } );
var [ canvas_chr, context_chr ] = get_context_for_id( "chr" );
var [ canvas_nta, context_nta ] = make_canvas(  256, 240 );
var [ canvas_ntb, context_ntb ] = make_canvas(  256, 240 );

var [ canvas_nts   , context_nts    ] = get_context_for_id( "nts"              );
var [ canvas_spr_bg, context_spr_bg ] = get_context_for_id( "layer-sprites-bg" );
var [ canvas_spr_fg, context_spr_fg ] = get_context_for_id( "layer-sprites-fg" );
var [ canvas_tiles , context_tiles  ] = get_context_for_id( "layer-tiles"      );

// var [ canvas_display, context_display ] = get_context_for_id( "display", { alpha : false, desynchronized : true });
var [ canvas_display, context_display ] = get_context_for_id( "display" );
var [ canvas_chr_total, context_chr_total ] = get_context_for_id( "chr-total" );

function render_chr() {
    var canvas  = canvas_chr;
    var context = context_chr;
    var w = canvas.width;
    var h = canvas.height;

    context.clearRect( 0, 0, w, h );

    for( var bp = 0; bp < 8; bp += 1 ) {
        var image = context.createImageData( 128, h );
        var data = image.data;

        for ( var i = 0; i < 512; i += 1 ) {
            var xx = i & 0xf; // i % 16;
            var yy = i >> 4;  // ( i - xx ) / 16

            for ( var x = 0; x < 8; x += 1 ) {
                for ( var y = 0; y < 8; y += 1 ) {
                    var j = i * 16 + y;

                    var lo = ( app.nes.cart.rom.chr_data[ j + 0 ] >> ( 7 - x ) ) & 1;
                    var hi = ( app.nes.cart.rom.chr_data[ j + 8 ] >> ( 7 - x ) ) & 1;

                    var c = lo | ( hi << 1 );

                    if ( c == 0 ) { continue; }

                    var ci = app.nes.ppu.read_vram( 0x3F00 + c + bp * 4 );

                    var palette = nes_palette;

                    if ( RENDER_TEST ) {
                        palette = [
                            [ 0x00, 0x00, 0x00 ],
                            [ 0x55, 0x55, 0x55 ],
                            [ 0xaa, 0xaa, 0xaa ],
                            [ 0xff, 0xff, 0xff ],
                        ];

                        ci = c;
                    }



                    var r = palette[ ci ][ 0 ];
                    var g = palette[ ci ][ 1 ];
                    var b = palette[ ci ][ 2 ];




                    var k = ( x + xx * 8 ) + ( y + yy * 8 ) * 128;

                    data[ k * 4     ] = r;
                    data[ k * 4 + 1 ] = g;
                    data[ k * 4 + 2 ] = b;
                    data[ k * 4 + 3 ] = 255;
                }
            }
        }

        context.putImageData( image, bp * 128, 0 );
    }
}

var ii, tile, sx, sy, dx, dy, p, x, y;

function get_xy_for_tile( i ) {
    var dx = i % 32;
    var dy = ( i - dx ) / 32;
    return [ dx, dy ];
}

function get_supertile_for_tile( dx, dy, name = 0 ) {
    var px = ( dx - ( dx % 4 ) ) / 4;
    var py = ( dy - ( dy % 4 ) ) / 4;
    var pi = px + py * 8;
    return 0x23C0 + name + pi;
}

function get_palette_for_tile( dx, dy, name = 0 ) {
    var st = get_supertile_for_tile( dx, dy, name );

    var ppx = ( ( dx % 4 ) & 0b10 ) / 2;
    var ppy = ( ( dy % 4 ) & 0b10 ) / 2;
    var ppi = ppx + ppy * 2;

    return ( app.nes.ppu.read_vram( st ) >> ppi * 2 ) & 0b11;
}

function draw_tile( context, i, name = 0, screen_x = 0, screen_y = 0 ) {
    ii = 0x2000 + i + name;
    tile = app.nes.ppu.read_vram( ii );
    tile = tile & 0xfff;

    var TALL = ( app.nes.ppu.control >> 5 ) & 1;

    if ( TALL == 0 ) {
        var bank = ( app.nes.ppu.control >> 4 ) & 1;
        tile = tile | ( bank << 8 );
    }

    sx = ( tile % 16 ) * 8;
    sy = ( ( tile - ( tile % 16 ) ) / 16 ) * 8;

    [ dx, dy ] = get_xy_for_tile( i );
    p = get_palette_for_tile( dx, dy, name );

    sx = tile * 8 % 128 + p * 128;

    x = dx * 8 + screen_x * 256;
    y = dy * 8 + screen_y * 240;

    context.clearRect( x, y, 8, 8 );
    context.drawImage( canvas_chr, sx, sy, 8, 8, x, y, 8, 8 );
}

function render_nts( context ) {
    var name = 0, screen_x = 0, screen_y = 0;

    for ( var i = 0; i < 0x03c0; i += 1 ) {
        draw_tile( context, i );
    }
}

function render_sprites( context_fg, context_bg ) {
    var y, tile, a, x;
    var p, flip_x, flip_y;
    var TALL;
    var bank = ( ( app.nes.ppu.control >> 3 ) & 1 ) << 8;
    var u, v;
    var context;

    for ( var i = 0; i < 64; i += 1 ) {
        y    = app.nes.ppu.oam[ i * 4 + 0 ];
        tile = app.nes.ppu.oam[ i * 4 + 1 ];
        a    = app.nes.ppu.oam[ i * 4 + 2 ];
        x    = app.nes.ppu.oam[ i * 4 + 3 ];

        y = y + 1;
        if ( y <= 1 ) { continue; }

        p = ( a & 0b11 ) + 4;
        flip_x = ( a >> 6 ) & 1;
        flip_y = ( a >> 7 ) & 1;

        if ( ( a >> 5 ) & 1 == 1 ) {
            context = context_bg;
        } else {
            context = context_fg;
        }

        context.setTransform( 1, 0, 0, 1, 0, 0  );
        context.translate( x, y );
        context.translate( 4, 4 );
        context.scale( flip_x ? -1 : 1, flip_y ? -1 : 1 );
        context.translate( -4, -4 );

        TALL = ( app.nes.ppu.control >> 5 ) & 1; // temp

        if ( TALL ) {
            if ( ( tile & 1 ) == 1 ) {
                tile = tile - 1 + 256;
            }
        } else {
            tile = tile | bank;
        }

        // NOTE copied from drawTile below
        u = ( tile % 16 ) * 8 + p * 128;
        v = ( ( tile - ( tile % 16 ) ) / 16 ) * 8;

        context.drawImage( canvas_chr, u, v, 8, 8, 0, 0, 8, 8 );

        // TODO render nametable as 8x16 and draw once
        // if ( TALL ) {
        //     tile = tile + 1;
        //     y = y + 8;
        //     var sx = ( tile % 16 ) * 8 + p * 128;
        //     var sy = ( ( tile - ( tile % 16 ) ) / 16 ) * 8;
        //     context.drawImage( canvas_chr, sx, sy, 8, 8, 0, 0, 8, 8 );
        // }
    }
}

function random_fill() {
    return "#" + Math.floor( Math.random() * 0xffffff ).toString( 16 );
}

var split_fills = [
    random_fill(),
    random_fill(),
    random_fill(),
    random_fill(),
    random_fill(),
    random_fill(),
    random_fill(),
    random_fill(),
    random_fill(),
];

function render_screen( context ) {
    var nt_x = ( app.nes.ppu.control >> 0 ) & 1;
    var nt_y = ( app.nes.ppu.control >> 1 ) & 1;

    var scroll_x = ( app.nes.ppu.t & 0b11111 ) * 8 + app.nes.ppu.x;
    var scroll_y = ( ( app.nes.ppu.t >> 5 ) & 0b11111 ) * 8 + ( ( app.nes.ppu.t >> 12 ) & 0b111 );

    scroll_x = scroll_x + nt_x * 256;
    scroll_y = scroll_y + nt_y * 240;

    // scroll_y = ( app.nes.ppu.t >> 12 ) & 0b111
    // console.log(  scroll_y );

    context.setTransform( 1, 0, 0, 1, 0, 0  );
    context.translate( -scroll_x, -scroll_y );
    context.drawImage( canvas_nts, 0, 0 );
    context.drawImage( canvas_nts, 512,   0 );
    context.drawImage( canvas_nts,   0, 480 );
}

function render_tiles( context, mask, offset ) {
    for ( var i = 0; i < 0x03c0 ; i += 1 ) {
        var redraw = false;

        var [ dx, dy ] = get_xy_for_tile( i + offset );
        var j = get_supertile_for_tile( dx, dy );
        var k = get_palette_for_tile( dx, dy );


        // tile changed
        if ( mask[ i ] == 1 ) {
            mask[ i ] = 0;
            redraw = true;
        }

        // supertile changed
        if ( mask[ j ] == 1 ) {
            mask[ j ] = 0;
            redraw = true;
        }

        // palette changed
        if ( app.nes.ppu.mask_palettes[ k * 4 ] == 1 ) {
            app.nes.ppu.mask_palettes[ k * 4 ] = 0;
            redraw = true;
        }

        if ( app.nes.ppu.mask_palettes[ k * 4 + 1 ] == 1 ) {
            app.nes.ppu.mask_palettes[ k * 4 + 1 ] = 0;
            redraw = true;
        }

        if ( app.nes.ppu.mask_palettes[ k * 4 + 2 ] == 1 ) {
            app.nes.ppu.mask_palettes[ k * 4 + 2 ] = 0;
            redraw = true;
        }

        if ( app.nes.ppu.mask_palettes[ k * 4 + 3 ] == 1 ) {
            app.nes.ppu.mask_palettes[ k * 4 + 3 ] = 0;
            redraw = true;
        }

        if ( RENDER_TEST ) {
            redraw = true;
        }

        if ( redraw ) {
            draw_tile( context, i, offset ); // todo pass vram
        }
    }
}

export function render_crt() {
    var bg_enabled = ( app.nes.ppu.mask >> 3 ) & 1;

    if ( RENDER_TEST ) {
        app.nes.ppu.render_chr = true
    }

    if ( app.nes.ppu.render_chr == true ) {
        app.nes.ppu.render_chr = false;
        render_chr();
    }

    context_nta.setTransform( 1, 0, 0, 1, 0, 0 );

    if ( bg_enabled == 1 ) {
        render_tiles( context_nta, app.nes.ppu.mask_nametable_a, 0     );
        render_tiles( context_ntb, app.nes.ppu.mask_nametable_b, 0xc00 );
    }

    context_nts.clearRect( 0, 0, 512, 480 );
    context_nts.drawImage( canvas_nta,   0,   0 );

    if ( app.nes.cart.rom.mirroring == 0 ) {
        context_nts.drawImage( canvas_ntb,   0, 240 );

        // TEMP
        context_nts.drawImage( canvas_nta, 256,   0 );
        context_nts.drawImage( canvas_ntb, 256, 240 );
    } else {
        context_nts.drawImage( canvas_ntb, 256,   0 );

        // TEMP
        context_nts.drawImage( canvas_nta,   0, 240 );
        context_nts.drawImage( canvas_ntb, 256, 240 );
    }


    context_tiles.setTransform( 1, 0, 0, 1, 0, 0 );
    context_tiles.clearRect( 0, 0, 256, 240 );
    render_screen( context_tiles );

    var sprites_enabled = ( app.nes.ppu.mask >> 4 ) & 1;

    if ( sprites_enabled == 1 ) {
        context_spr_bg.setTransform( 1, 0, 0, 1, 0, 0 );
        context_spr_bg.clearRect( 0, 0, 256, 240 );

        context_spr_fg.setTransform( 1, 0, 0, 1, 0, 0 );
        context_spr_fg.clearRect( 0, 0, 256, 240 );

        render_sprites( context_spr_fg, context_spr_bg );
    }

    var bg_color = nes_palette[ app.nes.ppu.read_vram( 0x3F00 ) ][ 3 ];
    document.body.style.background = bg_color;

    //

    context_display.fillStyle = bg_color;
    context_display.fillRect( 0, 0, 256, 240 );
    context_display.drawImage( canvas_spr_bg, 0, 0 );
    context_display.drawImage( canvas_tiles,  0, 0 );
    context_display.drawImage( canvas_spr_fg, 0, 0 );

    //

    context_chr_total.drawImage( canvas_chr, 0, 0, 128, 256, 0, 0, 128, 256 );
}
