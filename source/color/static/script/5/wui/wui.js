var wui = {};

wui.view = null;

var css_el = document.getElementById( "wui-css" );
// var js_el  = document.getElementById( "wui-js"  );

const modules = "picnic, canvas, swatch, slider, gradient, utility";

modules.split( ", " ).forEach( function( el, i ) {
	var script = document.createElement( "script" );
	script.src = "static/script/5/wui/" + el + ".js";
	document.currentScript.parentNode.appendChild( script );
});

function handle( event ) {
	var x = event.clientX - app.capture.el.getBoundingClientRect().left;
	var y = event.clientY - app.capture.el.getBoundingClientRect().top;
	app.capture.handle( x, y );
};

document.addEventListener( "mousemove", function( event ) {
	if ( app.capture ) {
		handle( event );
	}
});

document.addEventListener( "mouseup", function( event ) {
	if ( app.capture && app.capture.onRelease ) { app.capture.onRelease(); }
	app.capture = null;
});
