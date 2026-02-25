wui.swatch = function( el, rgb = null ) {
	if ( el == null ) {
		el = document.createElement( "div" );
		el.classList.add( "swatch");
		wui.view.appendChild( el );
	}

	this.el = el;
	this.rgb = {};
	this.hsl = {};
	this.sliders = [];

	var self = this;

	this.set = function( data, source = null ) {
		// dumb
		if ( data.rgb ) {
			this.rgb = data.rgb;
			this.hsl = rgb_to_hsl( this.rgb.r, this.rgb.g, this.rgb.b );
		} else if ( data.hsl ) {
			this.hsl = data.hsl;
			this.rgb = hsl_to_rgb( this.hsl.h, this.hsl.s, this.hsl.l );
		} else {
			this.rgb = data;
			this.hsl = rgb_to_hsl( this.rgb.r, this.rgb.g, this.rgb.b );
		}

		var hex = rgbToHex( this.rgb.r, this.rgb.g, this.rgb.b );

		this.el.style.background = hex;
		this.el.dataset.hex = hex.toUpperCase();

		this.sliders.forEach( function( el, i ) {
			if ( el != source ) { el.update(); }
		});
	};

	if ( rgb != null ) {
		this.set( rgb );
	}
};