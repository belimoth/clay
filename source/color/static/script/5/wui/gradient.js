wui.gradient = function( el ) {
	this.el = el;
	this.canvas = new wui.canvas( null, 512, 64, 1 );

	var div_el = document.createElement( "div" );

	el.appendChild( this.canvas.el );
	el.appendChild( div_el );

	function gradient_item () {
		this.el = document.createElement( "div" );
	}
};