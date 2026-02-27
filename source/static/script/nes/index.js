"use strict";

var el_drop = document.getElementById( "drop" );

el_drop.ondragenter = function( event ) {
    el_drop.classList.add( "drag-over" );
};

el_drop.addEventListener( "dragover", function( event ) {
    event.preventDefault();
});

el_drop.addEventListener( "drop", function( event ) {
    event.preventDefault();

    el_drop.classList.remove( "drag-over" );

    if ( event.dataTransfer.items ) {
        for ( var i = 0; i < event.dataTransfer.items.length; i += 1 ) {
            if ( event.dataTransfer.items[i].kind == "file" ) {
                var file = event.dataTransfer.items[i].getAsFile();

                var reader = new FileReader();

                reader.onload = function() {
                    var result = reader.result.split( "," )[ 1 ];
                    app.storage.roms[ file.name ] = result;
                    localStorage.setItem( "data.nes", JSON.stringify( app.storage ) );
                    render_rom_list();
                };

                reader.readAsDataURL( file )
            }
        }
    } else {
        // TODO
    }
});

el_drop.ondragleave = function( event ) {
    el_drop.classList.remove( "drag-over" );
};

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

app.storage = JSON.parse( localStorage.getItem( "data.nes" ) || "{ \"roms\" : {} }" );

function render_rom_list() {
    var el_roms = document.getElementById( "roms" );
    el_roms.innerHTML = "";

    Object.keys( app.storage.roms ).forEach( function( el, i ) {
        var el_li = document.createElement( "li" );
        var el_a  = document.createElement( "a"  );
        el_a.dataset.key = el;

        el_a.addEventListener( "click", function( event ) {
            document.body.classList.add( "hide-overlay" );
            app.nes.cpu.start();
            app.nes.load_rom( el );
            app.nes.play();
        });

        el_li.appendChild( el_a );
        el_roms.appendChild( el_li );
    });
}

render_rom_list();
