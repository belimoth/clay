"use strict";

import { app } from "../app.js"

export function canvas( el ) {
	this.el = el;
	this.el_canvas = el.children[0];

	const grid = 8;

	this.el.style[ "background-size" ] = grid + "px";

	const padding = 16;

	this.el_canvas.style.top  = padding + "px";
	this.el_canvas.style.left = padding + "px";

	const m = 4;

	this.resize = function() {
		this.x = this.el_canvas.getBoundingClientRect().left;
		this.y = this.el_canvas.getBoundingClientRect().top;

		this.scale = Math.max( 1, Math.min(
			Math.floor( ( el.offsetWidth  - padding * 2 ) / app.file.width  / m ) * m,
			Math.floor( ( el.offsetHeight - padding * 2 ) / app.file.height / m ) * m,
		));

		var width  = app.file.width  * this.scale;
		var height = app.file.height * this.scale;

		this.el_canvas.style.width  = width  + "px";
		this.el_canvas.style.height = height + "px";

		this.el_canvas.width  = width  * window.devicePixelRatio;
		this.el_canvas.height = height * window.devicePixelRatio;

		this.scale = this.scale * window.devicePixelRatio;
	};
}

export function screen_to_canvas( p ) {
	var s = app.ui.canvas.scale;

	return {
		x : Math.floor( p.x * window.devicePixelRatio / s ),
		y : Math.floor( p.y * window.devicePixelRatio / s ),
	};
}
