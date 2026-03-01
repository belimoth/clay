"use strict";

function rom_draw() {
    var el_rom = document.getElementById( "rom" );
    el_rom.innerHTML = "";

    Object.keys( app.storage.rom ).forEach( function( el, i ) {
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
        el_rom.appendChild( el_li );
    });
}

export function rom_init() {
	app.storage = JSON.parse( localStorage.getItem( "data.nes" ) || "{ \"rom\" : {} }" );
	rom_draw();
}
