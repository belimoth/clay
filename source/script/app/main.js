"use strict";

export function app_main() {
	const fps = 60;

	var interval = 1000 / fps;
	var time_old = 0;

	this.toPause = false;
	this.isRunning = false;

	this.loop = function( time_new ) {
		if ( this.toPause ) {
			this.toPause = false;
			this.isRunning = false;
			this.time_total += this.time - this.time_total; // NOTE dumb as hell
		} else {
			requestAnimationFrame( this.loop );
			var time_elapsed = time_new - time_old;

			if ( time_elapsed > interval ) {
				time_old = time_new - ( time_elapsed % interval );
				update();
			}
		}
	};

	this.time = 0;
	this.time_start = 0;
	this.time_total = 0;

	var t = 0;

	var timePrevious = 0;

	this.start = function() {
		time_old = window.performance.now();
		this.loop( time_old );
		this.isRunning = true;

		this.time_start = Math.floor( new Date().getTime() / 1000 );
	}



	function update() {
		t += 1;

		if ( true ) {
			this.time = Math.floor( new Date().getTime() / 1000 - this.time_start ) + this.time_total;

			if ( this.time != timePrevious ) {
				var time_formatted = time_format( this.time, true );
				document.getElementById( "clock" ).innerHTML = time_formatted;
				timePrevious = this.time;
			}
		}

		if ( this.toRepaint || this.replay ) {
			app_draw();
			this.toRepaint = false;
		}
	}

	window.addEventListener( "blur",  event => { this.toPause = true; });
	window.addEventListener( "focus", this.start );
}
