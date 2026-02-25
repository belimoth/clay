export function ppu_scroll() {
    this.write_scroll = function( value ) {
        // console.log( hex( this.t, 4 ) + " " + hex( this.v, 4 ) + " " + hex( this.w, 1 ) + " scroll write" );

        if ( this.w == 0 ) {
            this.scroll_x = value;
            this.t = ( this.t & 0xffe0 ) | ( value >> 3 );
            this.x = value & 0x07;
            this.w = 1;
        } else {
            this.scroll_y = value;
            this.t = ( this.t & 0x8c1f ) | ( ( value & 0x07 ) << 12 ) | ( ( value & 0xf8 ) << 2 );
            this.w = 0;
        }
    };
}