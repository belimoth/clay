"use strict";

import { tool_all } from "./main/tool.js";
import { palette  } from "./main/ui/palette.js";
import { canvas, screen_to_canvas } from "./main/ui.js";
import { layer    } from "./main/ui/layer.js";
import { storage   } from "./session.js";

// window

if (
	document.fullscreenEnabled       ||
	document.webkitFullscreenEnabled ||
	document.mozFullScreenEnabled    ||
	document.msFullscreenEnabled
) {
	document.getElementById( "a-fullscreen" ).addEventListener( "click", function() {
		var el = document.getElementById( "main" );
		el = document.body;

		if ( el.requestFullscreen       ) { el.requestFullscreen();       } else
		if ( el.webkitRequestFullscreen ) { el.webkitRequestFullscreen(); } else
		if ( el.mozRequestFullScreen    ) { el.mozRequestFullScreen();    } else
		if ( el.msRequestFullscreen     ) { el.msRequestFullscreen();     }
	});
} else {

}

function app_window_check_fullscreen() {
	// NOTE this will basically never work
	// if ( screen.width == window.innerWidth && screen.height == window.innerHeight ) {

	if ( screen.height == window.innerHeight ) {
		// NOTE unlike the following, this will only trigger on resize up, not down
		// onFullscreen();

		document.body.classList.add( "window-full" );
	} else {
		document.body.classList.remove( "window-full" );
	}

}

app_window_check_fullscreen();

function app_window_on_fullscreen() {

}

document.addEventListener( "fullscreenchange"      , app_window_on_fullscreen );
document.addEventListener( "webkitfullscreenchange", app_window_on_fullscreen );
document.addEventListener( "mozfullscreenchange"   , app_window_on_fullscreen );
document.addEventListener( "MSFullscreenChange"    , app_window_on_fullscreen );

//

function score( p ) {
	var s = app.ui.canvas.scale / window.devicePixelRatio;
	var q = { x : p.x % s, y : p.y % s };
	var half = ( s - 1 ) / 2;
	var d = Math.abs( q.x - half ) + Math.abs( q.y - half );
	return d <= half;
}

function hardLine( x0, y0, x1, y1, put ) {
	var dx = Math.abs( x1 - x0 );
	var dy = Math.abs( y1 - y0 );

	// if ( dx == 0 && dy == 0 ) { return; }

	var sx = x0 < x1 ? 1 : -1;
	var sy = y0 < y1 ? 1 : -1;

	var err = dx - dy;

	while( x0 != x1 || y0 != y1 ) {
		var e2 = err * 2;

		// NOTE inlining e2 below causes hangs because of javascript

		if ( e2 > -dy ) {
			err -= dy;
			x0  += sx;
		}

		if ( e2 < dx ) {
			err += dx;
			y0  += sy;
		}

		// x0 = Math.floor( x0 );
		// y0 = Math.floor( y0 );

		put( x0, y0 );
	}
}

export function wait_frame( callback ) {
	window.requestAnimationFrame( function( time ) { window.requestAnimationFrame( callback ); });
}











export let app = {
	mouse : null,
	stroke  : [],

	drawing : false,

	toRepaint :  true,
	toBake    : false,

	file : null,
	tool : null,

	ui : {
		canvas : null,
		palette : null,
	},

	context : {
		display : null,
		render  : null,
		stroke  : null,
		erase   : null,
		layer  : [],
	},

	layer_mode_index   : 1,
	layer_active_index : 2,
};

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

app.file = {
	width: 64,
	height: 64,

	history : [],

	layer : [
		{ type : "fill" },

		{
			type : "canvas",
			data : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABABAMAAABYR2ztAAAAKlBMVEUAAAAAAADwsBjw4Fjw8KhYWFjgiBjoWDBo0Gj4+PhAoECwUEC40PiI+Ih3NIgLAAAAAXRSTlMAQObYZgAAAVFJREFUSMftk7FOwzAQhps3yO9QiguLL20QIz5gL83IkiIPjK1E9sKQgYmJCIkhgq0sXbsxgcSDwOPgZiR2+gL5hlvus/07Ofc6OtrAjn6gdghCoX0DItUuHN+F7ScUhfIutkuRDYqlTxiEwHc/gzfk4fLls/hA6M/3s3r42gy8EYDH1bB8Xi/rNE0Q6+x3WJYb9ILIIQQnb9Pzclgasw4lOwQhqymPS2P3wat2CFGaTllfM/NY3pNLONsKZIVEPhUugS1EHHNyYK/iyFD3iWecoOa/sE9bEmPiPFIZoWpcc2H7ubmZ8TxCRqqZAnl+a2gcX4D7EZ86PzUWzAwROQVLpGEZpeiDETrHEe8iTS9VBVw5fzosRKMJJI7cUyEl7aXppCIJtyCI7RkqZg3PTLFWghRrCj1CTCoAtP/tiGRus5KtHoI8tEXY6gN1Qa+jw8Mf59FB5AK7Pn0AAAAASUVORK5CYII="
		},

		{ type : "canvas" },
	]
}

// NOTE this is fucked gotta do the ui too
// app.file.history = JSON.parse( app.storage.get( "history" ) || "[]" );

export function save_history() {
	// app.storage.set( "history", JSON.stringify( app.history ) );
	// console.log( app.storage.usage() );
}

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

// app.file = new file( document.getElementById( "example" ) );
app.tool = tool_all.pen_outline;
app.ui.canvas = new canvas( document.getElementById( "canvas" ) );

function initializeCanvasContext( canvas ) {
	var context = canvas.getContext( "2d" );

	context.webkitImageSmoothingEnabled = false;
	context.mozImageSmoothingEnabled    = false;
	context.msImageSmoothingEnabled     = false;
	context.imageSmoothingEnabled       = false;

	return context;
}

var canvasRender = document.getElementById( "canvas-render" );
var canvasStroke = document.getElementById( "canvas-stroke" );
var canvasErase  = document.getElementById( "canvas-erase"  );
// var canvasLayer  = document.getElementById( "canvas-layer"  );

canvasRender.width  = app.file.width;
canvasRender.height = app.file.height;

canvasStroke.width  = app.file.width;
canvasStroke.height = app.file.height;

canvasErase.width  = app.file.width;
canvasErase.height = app.file.height;

// canvasLayer.width  = app.file.width;
// canvasLayer.height = app.file.height;

app.context.render = initializeCanvasContext( canvasRender );
app.context.stroke = initializeCanvasContext( canvasStroke );
app.context.erase  = initializeCanvasContext( canvasErase  );
// app.context.layer  = initializeCanvasContext( canvasLayer  );

app.file.layer.forEach( function( el, i ) {
	var canvasLayer = document.createElement( "canvas" );
	canvasLayer.id = "canvas-layer-" + i;

	canvasLayer.width  = app.file.width;
	canvasLayer.height = app.file.height;

	document.getElementById( "offscreen" ).appendChild( canvasLayer );

	app.context.layer.push( initializeCanvasContext( canvasLayer ) );
});

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var thumbs = [];

function thumb( el ){
	this.el = el;
	this.context = initializeCanvasContext( el );

	el.width = 64;
	el.height = 64;
	el.style.width = "32px";
	el.style.height = "32px";
}

$$( "ul.layer-list > li > a > canvas.thumb" ).forEach( function( el, i ) {
	thumbs.unshift( new thumb( el ) );
});

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var waitingOn = 0

function load() {
	app.context.layer.forEach( function( el, i ) {
		var f_layer = app.file.layer[i];

		if ( f_layer.data ) {
			waitingOn += 1;

			context = el;
			f_layer.image = new Image();

			f_layer.image.onload = function() {
				waitingOn -= 1;
				context.drawImage( f_layer.image, 0, 0 );
			};

			f_layer.image.src = f_layer.data;
		}
	});
}

load();

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var firstRender = true;

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

var context;

export function app_draw() {
	if ( waitingOn > 0 ) { console.log( "waiting" ); return; }

	var w = app.file.width;
	var h = app.file.height;
	var s = app.ui.canvas.scale;

	if ( firstRender ) {
		firstRender = false;

		// context = app.context.layer[1]
		// context.drawImage( app.file.el, 0, 0 );

		// context = thumbs[1].context;
		// context.drawImage( app.file.el, 0, 0 );

		app.context.layer.forEach( function( el, i ) {
			context = thumbs[i].context;
			context.setTransform( 1, 0, 0, 1, 0, 0 );
			context.clearRect( 0, 0, w, h );
			context.drawImage( app.context.layer[i].canvas, 0, 0 );
		});
	}

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	if ( app.toRewind ) {
		app.toRewind = false;

		app.context.layer.forEach( function( el, i ) {
			context = el;
			context.setTransform( 1, 0, 0, 1, 0, 0 );
			context.clearRect( 0, 0, w, h );
		});

		app.context.layer.forEach( function( el, i ) {
			var f_layer = app.file.layer[i];

			context = el;

			if ( f_layer.image ) {
				context.drawImage( f_layer.image, 0, 0 );
			}
		});
	} else {
		if ( app.replay ) {
			app.replay_t = app.replay_t + 1;

			if ( app.replay_t > app.file.history[ app.replay_action_index ].stroke.length - 1 ) {
				if ( app.replay_action_index < app.file.history.length - 1 ) {
					app.replay_t = 0
					app.replay_action_index += 1
				} else {
					app.replay = false;

						writer.complete().then( function( blob ) {
							console.log( blob );
							document.getElementById( "video-download" ).href = URL.createObjectURL( blob );
							document.getElementById( "video-download" ).click();
						});
				}
			}

			if ( app.replay_t == app.file.history[ app.replay_action_index ].stroke.length - 1 ) {
				app.toBake = true;
			}
		}
	}

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	// NOTE profile this to determine where to put snapshots in history

	context = app.context.stroke;

	context.setTransform( 1, 0, 0, 1, 0, 0 );
	context.clearRect( 0, 0, w, h );

	var pPrevious = null;
	var imageStroke = context.createImageData( 64, 64 );
	var data = imageStroke.data;

	var stroke = [], rgb = {}, layer_active;

	if ( app.stroke.length > 0 ) {
		stroke = app.stroke;
		rgb = app.ui.palette.swatch_active.rgb;
		layer_active = app.context.layer[ app.layer_active_index ];
	}

	if ( app.history_item ) {
		stroke = app.history_item.stroke;
		rgb = { r : 255, g : 102, b : 238, erase : false };
	}

	if ( app.replay ) {
		var history_item = app.file.history[ app.replay_action_index ];
		stroke = history_item.stroke.slice( 0, app.replay_t );
		rgb = history_item.rgb;
		layer_active = app.context.layer[ history_item.layer_index ];
	}

	stroke.forEach( function( el, i ) {
		var p = screen_to_canvas( el );

		function put( x, y ) {
			if ( x >= 0 && x <= w - 1 && y >= 0 && y <= h - 1 ) {
				var i = ( y * w + x ) * 4 | 0;
				data[ i + 0 ] = rgb.r;
				data[ i + 1 ] = rgb.g;
				data[ i + 2 ] = rgb.b;
				data[ i + 3 ] = 255;
			}
		}

		// if ( i == 0 || i == app.stroke.length - 1 ) {
		if ( i == 0 ) {
			put( p.x, p.y );
			pPrevious = p;
		} else if ( Math.abs( p.x - pPrevious.x ) + Math.abs( p.y - pPrevious.y ) > 1 || score( el ) ) {
			hardLine( pPrevious.x, pPrevious.y, p.x, p.y, put );
			put( p.x, p.y );
			pPrevious = p;
		}
	});

	context.putImageData( imageStroke, 0, 0 );

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
	// NOTE with this there's no way to bake a stroke and start a new one on the same frame

	if ( app.toBake ) {
		app.toBake = false;
		app.stroke = [];

		if ( rgb.erase ) {
			// NOTE copied from below
			context = app.context.erase;
			context.setTransform( 1, 0, 0, 1, 0, 0 );
			context.clearRect( 0, 0, w, h );
			context.globalCompositeOperation = "copy";
			context.drawImage( layer_active.canvas, 0, 0 );
			context.globalCompositeOperation = "destination-out";
			context.drawImage( app.context.stroke.canvas, 0, 0 );
			context.globalCompositeOperation = "source-over";

			context = layer_active;
			context.setTransform( 1, 0, 0, 1, 0, 0 );
			context.globalCompositeOperation = "copy";
			context.drawImage( app.context.erase.canvas, 0, 0 );
			context.globalCompositeOperation = "source-over";

			// NOTE dumb
			// rgb.erase = false;
			// NOTE AGAIN that was bad it changes the swatch, still eating duplicate work below
		} else {
			context = layer_active;
			context.setTransform( 1, 0, 0, 1, 0, 0 );
			context.drawImage( app.context.stroke.canvas, 0, 0 );
		}

		context = app.context.stroke;
		context.setTransform( 1, 0, 0, 1, 0, 0 );
		context.clearRect( 0, 0, w, h );
	}

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	// NOTE same as above but loop is unnecessary here, we're only re-rendering activ layer thumb

	app.context.layer.forEach( function( el, i ) {
		if ( app.layer_active_index == i ) {
			context = thumbs[ i ].context;
			context.setTransform( 1, 0, 0, 1, 0, 0 );
			context.clearRect( 0, 0, w, h );

			if ( rgb.erase ) {
				// TODO
			} else {
				context.drawImage( app.context.layer[i].canvas, 0, 0 );
				context.drawImage( app.context.stroke.canvas, 0, 0 );
			}
		}
	});

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	context = app.context.render;
	context.setTransform( 1, 0, 0, 1, 0, 0 );
	context.clearRect( 0, 0, w, h );

	app.context.layer.forEach( function( el, i ) {
		if ( i == app.layer_active_index ) {
			if ( rgb.erase ) {
				context = app.context.erase;
				context.setTransform( 1, 0, 0, 1, 0, 0 );
				context.clearRect( 0, 0, w, h );
				context.globalCompositeOperation = "copy";
				context.drawImage( app.context.layer[i].canvas, 0, 0 );
				context.globalCompositeOperation = "destination-out";
				context.drawImage( app.context.stroke.canvas, 0, 0 );
				context.globalCompositeOperation = "source-over";

				context = app.context.render;
				context.drawImage( app.context.erase.canvas, 0, 0 );
			} else {
				context.drawImage( app.context.layer[i].canvas, 0, 0 );
				context.drawImage( app.context.stroke.canvas, 0, 0 );
			}
		} else {
			context.drawImage( app.context.layer[i].canvas, 0, 0 );
		}
	});

	context = app.context.display;
	context.setTransform( 1, 0, 0, 1, 0, 0 );

	if ( app.replay ) {
		context.drawImage( document.getElementById( "picnic" ), 0, 0 );
		context.scale( s, s );
	} else {
		context.scale( s, s );
		context.clearRect( 0, 0, w, h );
	}

	context.drawImage( app.context.render.canvas, 0, 0 );

	if ( app.replay ) {
		writer.addFrame( app.context.display.canvas );
	}

	/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

	if ( false ) {
		context.fillStyle = "#FF66EE";

		app.stroke.forEach( function( el, i  ) {
			var p = {
				x : el.x * window.devicePixelRatio / s,
				y : el.y * window.devicePixelRatio / s,
			};

			context.fillRect( p.x -1/8, p.y - 1/8, 1/4, 1/4 );
		});
	}

	if ( app.mouse ) {
		var p = screen_to_canvas( app.mouse );
		var s = app.ui.canvas.scale / window.devicePixelRatio;

		if ( true && app.drawing ) {
			context.fillStyle = "#FF66EE";
			context.fillRect( p.x + 1/8, p.y + 1/8, 3/4, 3/4 );
		} else {
			context.fillStyle = "#FF66EE";
			context.fillRect( p.x, p.y, 1, 1 );
		}

		if ( false ) {
			context.fillStyle = "#000000";
			context.fillRect( 0, 0, s, s );
			context.fillStyle = "#FFFFFF";

			for ( var x = 0; x < s; x += 1 ) {
				for ( var y = 0; y < s; y += 1 ) {
					if ( score({ x : x, y : y }) ) {
						context.fillRect( x, y, 1, 1 );
					}
				}
			}

			var q = { x : app.mouse.x % s, y : app.mouse.y % s };
			context.fillStyle = "#FF66EE";
			context.fillRect( q.x, q.y, 1, 1 );
		}
	}

	if ( false ) {
		s = app.ui.canvas.scale / window.devicePixelRatio;
		context.fillStyle = "#FF66EE";
		context.fillRect( 32 - 1/s, 0, 2 / s, 64 );
		context.fillRect( 0, 32 - 1/s, 64, 2 / s );
	}
}

export function app_canvas_resize() {
	app.ui.canvas.resize();
	app.context.display = initializeCanvasContext( app.ui.canvas.el_canvas );
	app.toRepaint = true;
}

// document.getElementById( "main" ).classList.add( "tools-focus", "layer-normal" );
app_canvas_resize();
app_draw();

function app_resize() {
	// NOTE i think this is getting fired in addition to onFullscreen below, double check
	app_window_check_fullscreen();
	app_canvas_resize();
}

window.addEventListener( "resize", app_resize );

// TODO don't need type : "mousedown" this already exists in event

app.ui.canvas.el.addEventListener( "mousedown", function( event ) {
	app.mouse = {
		x : ( event.clientX - app.ui.canvas.x ),
		y : ( event.clientY - app.ui.canvas.y ),
	};

	app.tool.handle({ type : "mousedown", data : { shift : event.shiftKey } });
	app.toRepaint = true;
});

document.addEventListener( "mouseup", function( event ) {
	app.mouse = {
		x : ( event.clientX - app.ui.canvas.x ),
		y : ( event.clientY - app.ui.canvas.y ),
	};

	app.tool.handle({ type : "mouseup", data : { shift : event.shiftKey } });
	app.toRepaint = true;
});

app.ui.canvas.el.addEventListener( "mouseout", function( event ) {
	// if ( app.drawing ) {
	// 	app.mouse = {
	// 		x : ( event.clientX - app.ui.canvas.x ),
	// 		y : ( event.clientY - app.ui.canvas.y ),
	// 	};

	// 	app.stroke.push( app.mouse );
	// }

	app.mouse = null;
	app.toRepaint = true;
});

app.ui.canvas.el.addEventListener( "mousemove", function( event ) {
	app.mouse = {
		x : ( event.clientX - app.ui.canvas.x ),
		y : ( event.clientY - app.ui.canvas.y ),
	};

	app.tool.handle({ type : "mousemove", data : { shift : event.shiftKey } });
	app.toRepaint = true;
});

document.addEventListener( "keyup", function( event ) {
	if ( app.drawing && event.key == "Shift" ) {
		app.drawing = false;
		app.toRepaint = true;
	}
});


//

app.storage = new storage();

app.ui.palette = new palette( $( "div.palette" ) );
app.ui.layer = new layer( document.getElementById( "layer" ) );
app.history_item = null;
