"use strict";

document.addEventListener( "contextmenu", event => { event.preventDefault(); });
document.addEventListener( "wheel",       event => { if ( event.ctrlKey ) event.preventDefault(); }, { "passive" : false });
document.addEventListener( "keydown",     event => { if ( event.ctrlKey && "-=".includes( event.key ) ) event.preventDefault(); });
