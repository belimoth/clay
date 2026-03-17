"use strict";

export let app = {
	mouse : null,
	stroke  : [],

	drawing : false,

	toRepaint :  true,
	toBake    : false,
	firstRender : true,

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
		layer   : [],
		preview : null,
	},

	layer_mode_index   : 1,
	layer_active_index : 2,

	thumbs : [],
};

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
