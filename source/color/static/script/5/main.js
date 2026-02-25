"use strict";

app.file = {};

window.addEventListener( "load", function() {
	document.getElementById( "loading" ).remove();

	var upload = document.getElementById( "upload" );

	upload.addEventListener( "change", function( event ) {
		var files = [];

		Array.from( upload.files ).forEach( function( el, i ) {
			// files.push( el );

			var div = document.createElement( "div" );
			var image = document.createElement( "img" );
			// div.appendChild( image );
			// document.getElementById( "images" ).appendChild( div );

			var reader = new FileReader();

			reader.addEventListener( "load", function( event ) {
				image.addEventListener( "load", function( event ) {
					var canvas = document.createElement( "canvas" );
					var w = app.file.width  = canvas.width  = image.naturalWidth;
					var h = app.file.height = canvas.height = image.naturalHeight;
					var context = canvas.getContext( "2d" );
					context.drawImage( image, 0, 0 );
					var imageData = context.getImageData( 0, 0, w, h );
					var data = imageData.data;

					var colors = {};

					for ( var y = 0; y < h; y += 1 ) {
						for ( var x = 0; x < w; x += 1 ) {
							var i = ( x + y * w ) * 4;

							var hex = rgbToHex( data[i+0], data[i+1], data[i+2] );

							if ( colors[ hex ] ) {
								colors[hex].count += 1;
							} else {
								colors[ hex ] = {
									hex : hex,
									count : 1,
								}
							}
						}
					}

					wui.view = document.getElementById( "palette" );

					for ( var key in colors ) {
						var color = colors[key];
						// console.log( color.hex, color.count );
						new wui.swatch().set( hexToRgb( color.hex ));
					}


					// div.appendChild( canvas );
				});

				app.file.image = event.target.result;
				image.src = event.target.result;
				// image.style.backgroundImage = "url(" + event.target.result + ")";
			});

			reader.readAsDataURL( el );
		});

		// console.log( files );
	});

	var w, h;

	w = clay.global.w = 512;
	h = clay.global.h = 75;

	wui.view = document.getElementById( "view-canvas" );

	// var canvas = new wui.canvas( null, w, h, 1 );

	// canvas.draw( function( data ) {
	// 	clay.xy.gb( data );
	// });

	// new wui.canvas( null, w, h, 1 ).draw( function( data ) {
	// 	clay.xy.rg( data );
	// });

	// new wui.canvas( null, w, h, 1 ).draw( function( data ) {
	// 	xyTO__( data, ( x, y ) => hsl_to_rgb( x / w, 1.0, 0.5 ) );
	// });
});
