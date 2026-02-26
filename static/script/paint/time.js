"use strict";

export function time_format( time, includeHours = false ) {
	var seconds = time % 60;
	var minutes = ( time - seconds ) / 60;

	var out = ":" + seconds.toString().padStart( 2, 0 );

	if ( includeHours ) {
		var minutesPm = minutes % 60;
		var hours     = ( minutes - minutesPm ) / 60;

		if ( hours > 0 ) {
			out = hours.toString() + ":" + minutesPm.toString().padStart( 2, 0 ) + out;
		} else {
			out = minutesPm.toString() + out;
		}
	} else {
		out = minutes.toString() + out;
		out = out.substr( out.length - 4 );
	}

	return out;
}
