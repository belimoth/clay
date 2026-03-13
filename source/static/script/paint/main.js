"use strict";

import "./reset.js"
import "./math.js"

import "./main/ui/canvas.js"
import "./main/tool.js"

import "./main/ui/scrubber.js"
import "./main/ui/tool.js"
import "./main/ui/layout.js"
import "./main/ui/palette.js"
import "./main/ui/layer.js"
import "./main/ui/history.js"

import "./app.js"
import "./wip.js"
import "./session.js"

import { app, app_canvas_resize } from "./app.js";

import { app_draw }          from "./main/draw.js";
import { update_layer_mode } from "./main/ui/layout.js";
import { update_tool_mode }  from "./main/ui/layout.js";
import { tool_init }         from "./main/ui/tool.js";

import { ui_list_layer }            from "./main/ui/layer.js";
import { palette }                  from "./main/ui/palette.js";
import { storage }                  from "./session.js";

app.storage = new storage();

app.ui.palette   = new palette( $( "div.palette" ) );
app.ui.layer     = new ui_list_layer();
app.history_item = null;

app_canvas_resize();
app_draw();


app.layer_mode_index = app.storage.get( "app.mode.layer" ) || 1;
update_layer_mode();
app.tool_mode_index = app.storage.get( "app.mode.tool" ) || 2;
update_tool_mode();

tool_init();

async function get_keyboard_layout() {
	let map = await navigator.keyboard.getLayoutMap();

	map.forEach( function( el, i ) {

	});
}

get_keyboard_layout();
