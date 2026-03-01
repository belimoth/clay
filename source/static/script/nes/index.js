"use strict";

import "/static/script/app/top.js";
import "/static/script/app/drop.js";
import { rom_init } from "/static/script/app/rom.js";

if ( window.Worker ) {
    var worker = new Worker( "worker.js" );
    worker.postMessage( "ok ok ok" );
} else {

}

window.onblur = function( event ) {

};

window.app = {};

import { nes } from "/static/script/nes/nes.js";

app.nes = new nes();

rom_init();
