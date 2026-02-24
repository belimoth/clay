"use strict";

export function rad_to_deg( angle ) { return angle * 180 / Math.PI; }
export function deg_to_rad( angle ) { return angle / 180 * Math.PI; }

export function rgb_to_hex( rgb ) {
	function c_to_hex(c) {
		let hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	return "#" +
		c_to_hex( Math.round( rgb.r ) ) +
		c_to_hex( Math.round( rgb.g ) ) +
		c_to_hex( Math.round( rgb.b ) );
}

export function hex_to_rgb( hex ) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );

	return result ? {
		r: parseInt( result[1], 16 ) * 1.0,
		g: parseInt( result[2], 16 ) * 1.0,
		b: parseInt( result[3], 16 ) * 1.0,
	} : null;
}
