"use strict";

$( "ul.tool-list" )._.delegate( "click", "ul.tool-list > li > a:not( [disabled] )", function( event ) {
	// $$( "ul.tool-list > li.recent" ).forEach( function( el, i ) {
	// 	el.classList.remove( "recent" );
	// });

	$$( "ul.tool-list > li.selected" ).forEach( function( el, i ) {
		if ( event.target.closest( "a" ).classList.contains( "modifier" ) ) {
			el.classList.add( "recent" );
		}

		el.classList.remove( "selected" );
	});

	event.target.closest( "li" ).classList.add( "selected" );
});

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

// TODO if more than one key is pressed down, remember most recent and unshadow if it is still pressed when newer key is released

export function tool_init() {
	$$( "ul.tool-list" ).forEach( function( el, i ) {
		var keys = [ "qwertyuiop", "asdfghjkl", "zxcvbnm" ];

		$$( "li > a", el ).forEach( function( el, j ) {
			el.dataset.label = keys[i][j];
		});
	});

	var toolKeys = "qwertyuiop";

	function get_tool_for_key( key ) {
		var i = toolKeys.indexOf( key );

		if ( i != -1 ) {
			var el = $( "ul.tool-list > li > a[data-label=" + event.key +"]" );

			if ( el && ! el.hasAttribute( "disabled" ) ) {
				return el;
			}
		}
	}

	var isMuted = false;

	document.addEventListener( "keydown", function( event ) {
		var el = get_tool_for_key( event.key );

		if ( el ) {
			el.closest( "ul" ).classList.add( "mute" );

			if ( ! isMuted ) {
				isMuted = true;

				$( el.closest( "ul" ) )._.once( "mousemove", function( event ) {
					isMuted = false;
					event.target.closest( "ul" ).classList.remove( "mute" );
				});
			}

			$$( "ul.tool-list > li.active" ).forEach( el => el.classList.remove( "active" ) );
			$$( "ul.tool-list > li.selected" ).forEach( el => el.classList.remove( "selected" ) );
			el.closest( "li" ).classList.add( "active" );
			el.closest( "li" ).classList.add( "selected" );
		}
	});

	document.addEventListener( "keyup", function( event ) {
		var el = get_tool_for_key( event.key );

		if ( el ) {
			el.closest( "li" ).classList.remove( "active" );
		}
	});
}
