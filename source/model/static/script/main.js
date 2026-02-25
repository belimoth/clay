Math.clip = function( number, min, max ) { return Math.max( min, Math.min( number, max ) ); }

var toBeSaved = false;

var autoSpin = true;
var previewAngle = 45;

var buttonSpin = document.getElementById( "buttonSpin" );
buttonSpin.classList.add( "active" );

buttonSpin.addEventListener( "click", function( event ) {
	autoSpin = ! autoSpin;

	if ( autoSpin ) {
		buttonSpin.classList.add( "active" );
	} else {
		buttonSpin.classList.remove( "active" );
		previewAngle = 45;
		updatePreview();
	}
});

var layer = new Array(8);

function assignLayerElements()  {
	for ( var n = 0; n < 8; n += 1 ) {
		var canvasTemp = document.getElementById( "canvasLayer" + n );

		layer[n] = {
			canvas: canvasTemp,
			context: initializeCanvasContext( canvasTemp ),
			tick: document.getElementById( "tickLayer" + n ),
			a: document.getElementById( "aLayer" + n )
		}

		layer[n].a.dataset.name = state.layer[n].name;
	}
}

var canvasAbove  = document.getElementById( "canvasAbove" );
var contextAbove = initializeCanvasContext( canvasAbove );

//var canvasBelow  = document.getElementById( "canvasBelow" );
//var contextBelow = initializeCanvasContext( canvasBelow );

var canvasGrid  = document.getElementById( "canvasGrid" );
var contextGrid = initializeCanvasContext( canvasGrid );
var context     = contextGrid;

context.lineWidth = 2 / 12;
context.lineCap   = "square";

context.scale( 12, 12 )

for ( var n = 0; n < 33; n += 1 ) {
	context.beginPath();
	context.moveTo( n,  0 );
	context.lineTo( n, 32 );
	context.stroke();

	context.beginPath();
	context.moveTo(  0, n );
	context.lineTo( 32, n );
	context.stroke();
}

var canvasRender  = document.getElementById( "canvasRender"  );
var canvasDisplay = document.getElementById( "canvasDisplay" );

canvasDisplay.focus();

function initializeCanvasContext( canvas, smooth = false ) {
	var context = canvas.getContext( "2d" );

	if ( !smooth ) {
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		context.msImageSmoothingEnabled = false;
		context.imageSmoothingEnabled = false;
	}

	return context;
}

var contextRender  = initializeCanvasContext( canvasRender, true );
var contextDisplay = initializeCanvasContext( canvasDisplay );

var angle = 0;
var mouse = null;
var pen   = null;
var near  = null;
var prev  = null;
var xMin, xMax, yMin, yMax;

//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 16+0*Math.floor(Math.random()*16); i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
	}

var state = {};
state.layer = new Array(8);

for ( var n = 0; n < 8; n += 1 ) {
	state.layer[n] = {
		name: "untitled layer",
		data: new Array( 32 * 32 ),
		grid: { x:0, y:0, w:1, h:1 },
		z: n * 2.0,
		id: n
	};

	state.layer[n].data.fill(0);
}

var layer_i = 0;

assignLayerElements();

layer.forEach( function( value, i ) {
	var index = i;

	value.a.addEventListener( "click", function( event ) {
		navigateToLayer( index );
	});
})

function _getData( i ) { return state.layer[layer_i].data[i]; }

function getData( i ) {
	if ( prev ) {
		xMin = Math.min( near.x, prev.x )
		xMax = Math.max( near.x, prev.x )
		yMin = Math.min( near.y, prev.y )
		yMax = Math.max( near.y, prev.y )

		var x = i % 32;
		var y = ( i - x ) / 32;

		if ( x >= xMin && x <= xMax && y >= yMin && y <= yMax ) {
			return color;
		}
	}

	return state.layer[layer_i].data[i];
}

function setData( i, value ) {
	state.layer[layer_i].data[i] = value;
}

function app_draw() {
	context = contextRender;
	var m = new Matrix();
	m.reset();m.applyToContext( context );

	context.clearRect( 0, 0, 600, 600 );

	context.font = "12px " + getComputedStyle( canvasDisplay, null ).getPropertyValue( "font-family" );

	//draw current layer
	m.translate( 108, 108 );
	m.scale( 12, 12 );
	m.translate( 16, 16 );
	m.rotate( angle * Math.PI/180 );
	m.translate( -16, -16 );
	m.applyToContext( context );

	context.fillStyle = "#FFFFFF";

	for ( var n = 0; n < 32 * 32; n += 1 ) {
		var x = n % 32;
		var y = ( n - x ) / 32;

		if ( getData(n) ) {
			context.fillRect( x - 1/12/2, y - 1/12/2, 1 + 2/12/2, 1 + 2/12/2 );
		}
	}

	m.scale( 1/12, 1/12 );
	m.applyToContext( context );

	//draw overlays
	new Matrix().applyToContext( context );
	context.globalAlpha = 0.5;
	context.drawImage( canvasAbove, 0, 0 );
	//context.drawImage( canvasBelow, 0, 0 );
	context.globalAlpha = 1.0;
	m.applyToContext( context );

	//draw grid
	context.globalAlpha = 0.0725;
	context.drawImage( canvasGrid, 0, 0 );
	context.globalAlpha = 1.0;

	m.scale( 12, 12 );
	m.applyToContext( context );

	context.globalAlpha = 0.25;

	context.fillStyle = "#000000";
	context.fillRect(      0, 16-1/12,  32, 2/12 );
	context.fillRect( 16-1/12,      0, 2/12,  32 );

	context.strokeStyle = "#000000";
	context.lineWidth = 2/12;
	context.strokeRect( 1/12*0, 1/12*0, 32 - 2/12*0, 32 - 2/12*0 );

	context.globalAlpha = 1.0;

	//draw outer grid breaks
	context.fillStyle = "#896A6E";

	for ( var i = 0; i < 32 * 32; i += 1 ) {
		var x = i % 32;
		var y = ( i - x ) / 32;

		var j;

		j = ( y - 1 ) * 32 + x;

		if ( getData(i) && ( x < 0 || x > 31 || y-1 < 0 || !getData(j) ) ) {
			context.fillRect( x-2/12, y-2/12, 1+4/12, 2/12 );
		}

		j = ( y + 1 ) * 32 + x;

		if ( getData(i) && ( j < 0 || j >= 32 * 32 || !getData(j) ) ) {
			context.fillRect( x-2/12, y+1, 1+4/12, 2/12 );
		}

		j = y * 32 + ( x - 1 );

		if ( getData(i) && ( x - 1 < 0 || !getData(j) ) ) {
			context.fillRect( x-2/12, y-2/12, 2/12, 1+4/12 );
		}

		j = y * 32 + ( x + 1 );

		if ( getData(i) && ( x + 1 > 31 || !getData(j) ) ) {
			context.fillRect( x+1, y-2/12, 2/12, 1+4/12 );
		}
	}

	//draw inner grid breaks
	context.fillStyle = "#FFFFFF";

	for ( var i = 0; i < 32 * 32; i += 1 ) {
		var x = i % 32;
		var y = ( i - x ) / 32;

		var j;

		j = ( y - 1 ) * 32 + x;

		if ( getData(i) && ( j < 0 || j >= 32 * 32 || !getData(j) ) ) {
			context.fillRect( x, y, 1, 2/12 );
		}

		j = ( y + 1 ) * 32 + x;

		if ( getData(i) && ( j < 0 || j >= 32 * 32 || !getData(j) ) ) {
			context.fillRect( x, y+10/12, 1, 2/12 );
		}

		j = y * 32 + ( x - 1 );

		if ( getData(i) && ( x-1<0 || !getData(j) ) ) {
			context.fillRect( x, y, 2/12, 1 );
		}

		j = y * 32 + ( x + 1 );

		if ( getData(i) && ( x+1>31 || !getData(j) ) ) {
			context.fillRect( x+10/12, y, 2/12, 1 );
		}

		//corners

		j = ( y - 1 ) * 32 + ( x - 1 );

		if ( getData(i) && ( y-1<0 || x-1<0  || !getData(j) ) ) {
			context.fillRect( x, y, 2/12, 2/12 );
		}

		j = ( y - 1 ) * 32 + ( x + 1 );

		if ( getData(i) && ( y-1<0 || x+1>31 || !getData(j) ) ) {
			context.fillRect( x+10/12, y, 2/12, 2/12 );
		}

		j = ( y + 1 ) * 32 + ( x - 1 );

		if ( getData(i) && ( y+1>31 || x-1<0 || !getData(j) ) ) {
			context.fillRect( x, y+10/12, 2/12, 2/12 );
		}

		j = ( y + 1 ) * 32 + ( x + 1 );

		if ( getData(i) && ( y+1>31 || x+1>31 || !getData(j) ) ) {
			context.fillRect( x+10/12, y+10/12, 2/12, 2/12 );
		}
	}

	//draw pivot
	context.strokeStyle = "#000000";
	context.globalAlpha = 0.25;
	context.beginPath();
	context.ellipse( 16, 16, 1/2, 1/2, 0, 0, 2*Math.PI );
	context.stroke();
	context.globalAlpha = 1.0;

	//draw cursor
	pen = null;
	near = null;

	if ( mouse ) {
		var x, y;

		x = mouse.x;
		y = mouse.y;

		var p = m.inverse().applyToPoint( x, y );

		x = Math.floor( p.x );
		y = Math.floor( p.y );

		near = { x : Math.clip( x, 0, 31 ), y : Math.clip( y, 0, 31 ) }

		context.strokeStyle = "#00FFFF";
		context.lineWidth = 2/12;

		if ( prev ) {
			xMin = Math.min( near.x, prev.x )
			xMax = Math.max( near.x, prev.x )
			yMin = Math.min( near.y, prev.y )
			yMax = Math.max( near.y, prev.y )

			context.strokeRect( xMin, yMin, xMax - xMin + 1, yMax - yMin + 1);
		} else {
			if ( x >= 0 && x <= 31 && y >= 0 && y <= 31 ) {
				pen = { x : x, y : y };

				context.strokeRect( x, y, 1, 1 );
			}
		}
	}

	//render to display
	context = contextDisplay;
	m.reset();
	m.scale( 2, 2 );
	m.applyToContext( context );
	context.fillStyle = "#896A6E";
	context.fillRect( 0, 0, 600, 600 );
	context.drawImage( canvasRender, 0, 0 );
}

function updateLayer() {
	context = layer[layer_i].context;
	context.setTransform( 1, 0, 0, 1, 0, 0 );
	context.clearRect( 0, 0, 64, 64 );
	context.scale( 2, 2 );
	context.fillStyle = "#FFFFFF"

	for ( var n = 0; n < 32 * 32; n += 1 ) {
		if ( getData(n) ) {
			var x = n % 32;
			var y = ( n - x ) / 32;
			context.fillRect( x, y, 1, 1 );
		}
	}
}

function updateComposite() {
	context = contextAbove;
	context.setTransform( 1, 0, 0, 1, 0, 0 );
	context.clearRect( 0, 0, 600, 600 );
	context.fillStyle = "#FFEEAA";

	for ( var nn = 0; nn < 8; nn += 1 ) {
		if ( nn > layer_i ) {
			context.setTransform( 1, 0, 0, 1, 0, 0 );
			context.translate( 108, 108 );
			context.scale( 12, 12 );
			context.translate( 16, 16 + state.layer[layer_i].z - state.layer[nn].z );
			context.rotate( angle * Math.PI/180 );
			context.translate( -16, -16 );

			for ( var n = 0; n < 32 * 32; n += 1 ) {
				var x = n % 32;
				var y = ( n - x ) / 32;

				if ( state.layer[nn].data[n] ) {
					context.fillRect( x - 1/12/2, y - 1/12/2, 1 + 2/12/2, 1 + 2/12/2 );
				}
			}
		}
	}

	//context = contextBelow;
	//context.setTransform( 1, 0, 0, 1, 0, 0 );
	//context.clearRect( 0, 0, 600, 600 );
	context.fillStyle = "#FFEEAA";

	for ( var nn = 0; nn < 8; nn += 1 ) {
		if ( nn < layer_i ) {
			context.setTransform( 1, 0, 0, 1, 0, 0 );
			context.translate( 108, 108 );
			context.scale( 12, 12 );
			context.translate( 16, 16 + context.translate( 16, 16 + state.layer[llayer_iayer].z - state.layer[nn].z ) );
			context.rotate( angle * Math.PI/180 );
			context.translate( -16, -16 );

			for ( var n = 0; n < 32 * 32; n += 1 ) {
				var x = n % 32;
				var y = ( n - x ) / 32;

				if ( state.layer[nn].data[n] ) {
					context.fillRect( x - 1/12/2, y - 1/12/2, 1 + 2/12/2, 1 + 2/12/2 );
				}
			}
		}
	}
}


var canvasPreview = document.getElementById( "canvasPreview" );
var contextPreview = initializeCanvasContext( canvasPreview );

var canvasShadow  = document.getElementById( "canvasShadow" );
var contextShadow = initializeCanvasContext( canvasShadow );

var canvasStencil  = document.getElementById( "canvasStencil" );
var contextStencil = initializeCanvasContext( canvasStencil );

function updatePreview() {
	context = contextShadow;
	context.setTransform( 1, 0, 0, 1, 0, 0 );
	context.clearRect( 0, 0, 256, 256 );

	context = contextPreview;
	context.setTransform( 1, 0, 0, 1, 0, 0 );
	context.clearRect( 0, 0, 256, 256 );

	for ( var nn = 7; nn > -1; nn -= 1 ) {
		context = contextStencil;
		context.setTransform( 1, 0, 0, 1, 0, 0 );
		context.clearRect( 0, 0, 256, 256 );
		context.fillStyle = "#FFFFFF"
		context.globalCompositeOperation = "source-over";
			context.setTransform( 1, 0, 0, 1, 0, 0 );
			context.translate( 64, 64 );
			context.scale( 4, 4 );
			context.translate( 16, 16 );
			//context.translate( 16, 16 + 8-state.layer[nn].z );
			context.rotate( previewAngle * Math.PI/180 );
			context.translate( -16, -16 );

			for ( var n = 0; n < 32 * 32; n += 1 ) {
				var x = n % 32;
				var y = ( n - x ) / 32;

				if ( state.layer[nn].data[n] ) {
					context.fillRect( x - 1/4/2, y - 1/4/2, 1 + 2/4/2, 1 + 2/4/2 );
				}
			}

		if ( state.layer[nn].z > 0 ) {
			context.globalCompositeOperation = "source-atop";
				context.setTransform( 1, 0, 0, 1, 0, 0 );
				context.drawImage( canvasShadow, 0, 0 );

			context = contextShadow;
			context.fillStyle = "#674F52";
			context.globalCompositeOperation = "source-over";
				context.setTransform( 1, 0, 0, 1, 0, 0 );
				context.translate( 64, 64 );
				context.scale( 4, 4 );
				context.translate( 16, 16 );
				//context.translate( 16, 16 + 8-state.layer[nn].z );
				context.rotate( previewAngle * Math.PI/180 );
				context.translate( -16, -16 );

				for ( var n = 0; n < 32 * 32; n += 1 ) {
					var x = n % 32;
					var y = ( n - x ) / 32;

					if ( state.layer[nn].data[n] ) {
						context.fillRect( x - 1/4/2, y - 1/4/2, 1 + 2/4/2, 1 + 2/4/2 );
					}
				}
		}

		context = contextPreview;
		context.globalCompositeOperation = "destination-over";
		context.setTransform( 1, 0, 0, 1, 0, 0 );
		context.translate( 0, (8-state.layer[nn].z)*4 );
		//context.translate( 64, 64 );
		context.drawImage( canvasStencil, 0, 0 );
	}

	context = contextPreview;
	context.globalCompositeOperation = "destination-over";
	context.setTransform( 1, 0, 0, 1, 0, 0 );
	context.translate( 0, (8-0)*4 );
	//context.translate( 64, 64 );
	context.drawImage( canvasShadow, 0, 0 );
}

app_draw();

function update() {

}

var color = 0;
var r = canvasDisplay.getBoundingClientRect();

canvasDisplay.addEventListener( "mousemove", function( event ) {
	canvasDisplay.focus();

	mouse = {
		x: Math.floor( ( event.clientX - r.left ) / 1.0 ),
		y: Math.floor( ( event.clientY - r.top  ) / 1.0 )
	};
});

canvasDisplay.addEventListener( "mouseleave", function( event ) {
	mouse = null;
	prev  = null;
});

canvasDisplay.addEventListener( "mousedown", function( event ) {
	if ( pen ) {
		prev = pen;

		var i = pen.y * 32 + pen.x;
		color = 1 - _getData(i);
	}
});

canvasDisplay.addEventListener( "mouseup", function( event ) {
	if ( prev ) {
		for ( var x = xMin; x <= xMax; x += 1 ) {
		for ( var y = yMin; y <= yMax; y += 1 ) {
			setData( y * 32 + x, color );
		}
		}
	}

	prev = null;

	updateLayer();
	updatePreview();
	toBeSaved = true;
});


var textName = document.getElementById( "textLayerName" );
var range = document.getElementById( "rangeHeight" );

function navigateToLayer( layerNew ) {
	layer[layer_i].a.parentElement.classList.remove( "active" );
	layer_i = layerNew;
	//location.hash = "layer" + layer;
	layer[layer_i].a.parentElement.classList.add( "active" );
	canvasDisplay.focus();

	range.value = 32-state.layer[layer_i].z*2;

	var valueNew = state.layer[layer_i].name;
	if ( valueNew == "untitled layer" ) { valueNew = ""; }
	textName.value = valueNew;

	updateComposite();
}

textName.addEventListener( "input", function( event ) {
	var valueNew = textName.value;
	if ( valueNew == "" ) { valueNew = "untitled layer"; }
	state.layer[layer_i].name = valueNew;

	toBeSaved = true;

	assignLayerElements();
});

canvasDisplay.addEventListener( "keydown", function( event ) {
	switch( event.keyCode ) {
		//case 65: angle = angle - 1; updateComposite();break;
		//case 68: angle = angle + 1; updateComposite();break;
		//case 83: angle = 0;         updateComposite();break;

		//case 69: navigateToLayer( Math.min( 7, layer + 1 ) ); break;
		//case 81: navigateToLayer( Math.max( 0, layer - 1 ) ); break;
	}
});

var spin = document.getElementById( "rangeRotation" );

spin.addEventListener( "input", function( event ) {
	angle = spin.value;
	updateComposite();
});

spin.addEventListener( "change", function( event ) {
	spin.value = Math.floor( ( spin.value / 15 ) + 0.5 ) * 15;
	angle = spin.value;
	updateComposite();
});

var side = document.getElementById( "side" );

document.getElementById( "buttonBack" ).addEventListener( "click", function( event ) {
	//side.classList.add( "panel-root" );
	//side.classList.remove( "panel-layer" );

	side.classList.toggle( "panel-root" );
});

var previousValue = range.value;

range.addEventListener( "input", function( event ) {
	var invalid = false;

	for ( var n = 0; n < 8; n += 1 ) {
		if ( n != layer && state.layer[n].z == ( 32-range.value ) / 2 ) {
			invalid = true;
		}
	}

	range.classList.remove( "invalid" );

	if ( invalid ) {
		range.classList.add( "invalid" );
		range.value = previousValue;
		return 0;
	}

	previousValue = range.value

	state.layer[layer_i].z = ( 32-range.value ) / 2;
	var layerId = state.layer[layer_i].id;
	state.layer.sort( function( a, b ) { return a.z - b.z; });

	var layerKept = state.layer.reduce( function( a, el, i ) {
		if ( el.id == layerId ) { return i; }
		return a;
	}, -1 );

	assignLayerElements();
	updateComposite();
	updatePreview();

	for ( var n = 0; n < 8; n += 1 ) {
		layer = n;
		updateLayer();
		layer[n].a.parentElement.classList.remove( "active" );
	}

	navigateToLayer( layerKept );

	updateTicks();
});

range.addEventListener( "change", function( event ) {
	toBeSaved = true;
});

//document.getElementById( "buttonMore" ).addEventListener( "click", function( event ) {
//	side.classList.remove( "panel-root" );
//	side.classList.add( "panel-layer" );
//});

function saveData() {
	var someJson = JSON.stringify( state );
	localStorage.setItem( "state", someJson );

	aDownload.setAttribute( "href", "data:text/json;charset=utf-8," + someJson );
}

function loadData() {
	var temp = JSON.parse( localStorage.getItem( "state" ) );

	if ( temp ) {

	} else {
		var tank = '{"layer":[{"name":"untitled layer","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"grid":{"x":0,"y":0,"w":1,"h":1},"z":0,"id":0},{"name":"untitled layer","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"grid":{"x":0,"y":0,"w":1,"h":1},"z":2,"id":1},{"name":"untitled layer","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"grid":{"x":0,"y":0,"w":1,"h":1},"z":3,"id":2},{"name":"untitled layer","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"grid":{"x":0,"y":0,"w":1,"h":1},"z":3.5,"id":3},{"name":"untitled layer","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"grid":{"x":0,"y":0,"w":1,"h":1},"z":4,"id":4},{"name":"untitled layer","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"grid":{"x":0,"y":0,"w":1,"h":1},"z":15,"id":5},{"name":"untitled layer","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"grid":{"x":0,"y":0,"w":1,"h":1},"z":15.5,"id":6},{"name":"untitled layer","data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"grid":{"x":0,"y":0,"w":1,"h":1},"z":16,"id":7}]}';

		temp = JSON.parse( tank );
	}

	if ( temp ) {
		state = temp;

		for ( var n = 7; n > -1; n += -1 ) {
			layer = n;
			updateLayer();
		}

		updatePreview();
		updateTicks();
		updateComposite();
		assignLayerElements();
	}
}

function clearData() {
	localStorage.removeItem( "state" );
}

function updateTicks() {
	for ( var n = 0; n < 8; n += 1 ) {
		layer[n].tick.style.bottom = ( Math.floor( state.layer[n].z * 2*(532-10)/32 ) + 34 + 2 ) + "px";
	}
}

updateTicks();
navigateToLayer( 0 );
loadData();


var aDownload = document.getElementById( "aDownload" );
var buttonSave = document.getElementById( "buttonSave" );

setInterval( function() {
	//angle = angle + 1;
	update();
	app_draw();

	if ( toBeSaved ) {
		saveData();
		toBeSaved = false;
	}

	if ( autoSpin ) {
		previewAngle = ( previewAngle + 2 ) % 360;
		updatePreview();
	}
}, 1000 / 30 );
