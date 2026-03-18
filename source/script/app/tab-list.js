"use strict";

export function tab_list( el ) {
	this.el = el;
	this.tab = [];
	this.page = [];

	let self = this;

	Array.from( el.children ).forEach( function( el, i ) {
		// if ( i == self.el.children.length - 1 ) return;
		self.tab.push( el );
	});

	el.parentNode.querySelectorAll( "page" ).forEach( el => self.page.push( el ) );

	el.addEventListener( "click", function( event ) {
		let el = event.target.closest( "a" );

		if ( el ) {
			let i = Array.prototype.indexOf.call( el.parentNode.parentNode.children, el.parentNode );

			if ( i < self.tab.length ) {
				self.el.querySelector( "li[active]" ).removeAttribute( "active" );
				self.el.parentNode.querySelector( "page[active]" ).removeAttribute( "active" );
				self.tab [i].setAttribute( "active", "" );
				self.page[i].setAttribute( "active", "" );
			}
		}
	});
}
