"use strict";

import { app, repaintSpectrum } from "./main.js"

export let toggle = false;

document.addEventListener( "keypress", function( event ) {
	if ( event.key == " " ) {
		toggle = ! toggle;
		repaintSpectrum();
	}
});

document.addEventListener( "mousedown", function( event ) {
	var hue_el = event.target.closest( "div.hue" );

	// TODO just check capture;
	if ( app.capture ) {
		if ( app.capture == app.hue.mf || app.capture == app.hue.ms || app.capture == app.xym ) {
			app.paused = false;
		} else {
			app.paused = true;
		}

		app.xStart = event.clientX - app.capture.el.getBoundingClientRect().left;
		app.vStart = app.hue_value
	}
});

document.addEventListener( "mouseup", function( event ) {
	app.capture = null;
});

document.addEventListener( "mousemove", function( event ) {
	if ( app.capture ) {
		var x = event.clientX - app.capture.el.getBoundingClientRect().left;
		var y = event.clientY - app.capture.el.getBoundingClientRect().top;

		app.capture.handle( x, y )
	}
});

document.getElementById( "button-generate" ).addEventListener( "click", function( event ) {
	event.preventDefault();

	var seed_el = document.getElementById( "input-seed" );
	var toReseed = ! document.getElementById( "input-keep" ).checked;

	if ( toReseed ) {
		var seed = Date.now().toString();
		seed = parseInt( seed.slice( seed.length - 7, seed.length - 4 ) + "000" );

		if ( seed == app.seedPrevious ) {
			app.seedPrevious = seed;
			seed += app.plus;
			app.plus += 1;
		} else {
			app.seedPrevious = seed;
			app.plus = 1;
		}

		seed_el.value = seed;
	}

	Math.seedrandom( seed_el.value );
	app.palette.generate();
	repaintSpectrum();
});
