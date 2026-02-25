const INTERRUPT_NONE  = 0;
const INTERRUPT_IRQ   = 1;
const INTERRUPT_NMI   = 2;
const INTERRUPT_RESET = 3;

const APU_CLOCK = 1000 / 240;

var pads = [];
var pad_buttons = [];

export function update_pads() {
	var pad = navigator.getGamepads()[1];

	if ( pad ) {
		// for ( var i = 0; i < pad.buttons.length; i += 1 ) {
		// 	if ( pad.buttons[i].pressed ) { console.log( "button : " + i ); }
		// }

		// for ( var i = 0; i < pad.axes.length; i += 1 ) {
		// 	if ( Math.abs( pad.axes[i] ) > 0.5 ) { console.log("axis: " + i + " = " + pad.axes[i] ); } 
		// }

		pad_buttons = [
			pad.buttons[ 1 ].pressed,
			pad.buttons[ 2 ].pressed,
			pad.buttons[ 8 ].pressed,
			pad.buttons[ 9 ].pressed,
			pad.axes[ 1 ] == -1 ? 1 : 0,
			pad.axes[ 1 ] ==  1 ? 1 : 0,
			pad.axes[ 0 ] == -1 ? 1 : 0,
			pad.axes[ 0 ] ==  1 ? 1 : 0,
		];
	}
}

// 0 - A
// 1 - B
// 2 - Select
// 3 - Start
// 4 - Up
// 5 - Down
// 6 - Left
// 7 - Right

var button_names = [
	"A",
	"B",
	"Select",
	"Start",
	"Up",
	"Down",
	"Left",
	"Right",
];


var keys = {};

const BUTTON_A      = 0;
const BUTTON_B      = 1;
const BUTTON_SELECT = 2;
const BUTTON_START  = 3;
const BUTTON_UP     = 4;
const BUTTON_DOWN   = 5;
const BUTTON_LEFT   = 6;
const BUTTON_RIGHT  = 7;

var button_to_key = [
	70,
	68,
	16,
	13,
	38,
	40,
	37,
	39,
];

keys[ button_to_key[ BUTTON_A      ] ] = 0;
keys[ button_to_key[ BUTTON_B      ] ] = 0;
keys[ button_to_key[ BUTTON_SELECT ] ] = 0;
keys[ button_to_key[ BUTTON_START  ] ] = 0;
keys[ button_to_key[ BUTTON_UP     ] ] = 0;
keys[ button_to_key[ BUTTON_DOWN   ] ] = 0;
keys[ button_to_key[ BUTTON_LEFT   ] ] = 0;
keys[ button_to_key[ BUTTON_RIGHT  ] ] = 0;

window.addEventListener( "gamepadconnected", function( event ) {
	console.log(
		"Gamepad connected at index %d: %s. %d buttons, %d axes.",
		event.gamepad.index,
		event.gamepad.id,
		event.gamepad.buttons.length,
		event.gamepad.axes.length
	);
});

window.addEventListener("gamepaddisconnected", function(e) {
	console.log(
		"Gamepad disconnected from index %d: %s",
		e.gamepad.index,
		e.gamepad.id
	);
});

// TODO prevent impossible key states ( up + down etc)

window.onkeyup   = function( event ) {
	keys[ event.keyCode ] = 0;

	switch ( event.keyCode ) {
		case button_to_key[ BUTTON_A      ] :
		case button_to_key[ BUTTON_B      ] :
		case button_to_key[ BUTTON_SELECT ] :
		case button_to_key[ BUTTON_START  ] :
		case button_to_key[ BUTTON_UP     ] :
		case button_to_key[ BUTTON_DOWN   ] :
		case button_to_key[ BUTTON_LEFT   ] :
		case button_to_key[ BUTTON_RIGHT  ] :
			event.preventDefault();
			break;
	}
};

window.onkeydown = function( event ) {
	keys[ event.keyCode ] = 1;

	switch ( event.keyCode ) {
		case button_to_key[ BUTTON_A      ] :
		case button_to_key[ BUTTON_B      ] :
		case button_to_key[ BUTTON_SELECT ] :
		case button_to_key[ BUTTON_START  ] :
		case button_to_key[ BUTTON_UP     ] :
		case button_to_key[ BUTTON_DOWN   ] :
		case button_to_key[ BUTTON_LEFT   ] :
		case button_to_key[ BUTTON_RIGHT  ] :
			event.preventDefault();
			break;
	}
};

function update_pad() {
	app.nes.apu.pad[0] = [
		keys[ button_to_key[ BUTTON_A      ] ] | pad_buttons[ BUTTON_A      ],
		keys[ button_to_key[ BUTTON_B      ] ] | pad_buttons[ BUTTON_B      ],
		keys[ button_to_key[ BUTTON_SELECT ] ] | pad_buttons[ BUTTON_SELECT ],
		keys[ button_to_key[ BUTTON_START  ] ] | pad_buttons[ BUTTON_START  ],
		keys[ button_to_key[ BUTTON_UP     ] ] | pad_buttons[ BUTTON_UP     ],
		keys[ button_to_key[ BUTTON_DOWN   ] ] | pad_buttons[ BUTTON_DOWN   ],
		keys[ button_to_key[ BUTTON_LEFT   ] ] | pad_buttons[ BUTTON_LEFT   ],
		keys[ button_to_key[ BUTTON_RIGHT  ] ] | pad_buttons[ BUTTON_RIGHT  ],
	];

	app.nes.apu.pad[1] = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
}

export function apu() {
	this.pad = [
		[ 0, 0, 0, 0, 0, 0, 0, 0 ],
		[ 0, 0, 0, 0, 0, 0, 0, 0 ]
	];

	this.strobe = 0;
	this.pad_i = 0;

	this.update_fixed = function() {
		for ( var i = 0; i < 4; i += 1 ) {
			this.frame_counter.step();

			// this.channels[0].update_gain();
			// this.channels[1].update_gain();

			// gain_0.gain.setValueAtTime( this.channels[0].gain, audio.currentTime + i / 240 );		
			// gain_1.gain.setValueAtTime( this.channels[1].gain, audio.currentTime + i / 240 );
		}

		this.channels[0].update_gain();
		this.channels[1].update_gain();
		this.channels[2].update_gain();

		app.audio.gain_nodes[ 0 ].gain.value = this.channels[0].gain;
		app.audio.gain_nodes[ 1 ].gain.value = this.channels[1].gain;
		app.audio.gain_nodes[ 2 ].gain.value = this.channels[2].gain;

		if ( this.channels[0].gain != 0 ) { this.channels[0].update_frequency( app.audio.wave_nodes[0] ); }
		if ( this.channels[1].gain != 0 ) { this.channels[1].update_frequency( app.audio.wave_nodes[1] ); }
		if ( this.channels[2].gain != 0 ) { this.channels[2].update_frequency( app.audio.wave_nodes[2] ); }
	};

	this.frame_counter = new function() {
		this.mode = 0; // TODO
		this.i = 0;

		this.step = function() {
			this.i = ( this.i + 1 ) % 4;

			app.nes.apu.channels[0].envelope.step();
			app.nes.apu.channels[1].envelope.step();
			app.nes.apu.channels[2].step_linear_counter();

			if ( this.i == 1 || ( this.i == 3 && this.mode == 0 ) || ( this.i == 4 && this.mode == 1 ) ) {
				app.nes.apu.channels[0].length_counter.step();
				app.nes.apu.channels[1].length_counter.step();
				app.nes.apu.channels[2].length_counter.step();
					
				app.nes.apu.channels[0].sweep.step();
				app.nes.apu.channels[1].sweep.step();
			}

			if ( this.i == 3 && this.mode == 0 ) {
				// if ( app.nes.cpu.p_i == 0 ) {
				if ( this.irq_inhibit == 0 ) {
					app.nes.cpu.interrupt_pending = INTERRUPT_IRQ;
					console.log( "IRQ" );
				}
			}
		};
	}();

	function envelope() {
		this.loop = 0;
		this.divider_period = 0;

		this.start   = 0;
		this.divider = 0;
		this.decay   = 0;

		this.step = function() {
			if ( this.start == 1 ) {
				this.start   = 0;
				this.decay   = 15;
				this.divider = this.divider_period;
			} else {
				if ( this.divider == 0 ) {
					this.divider = this.divider_period;

					if ( this.decay == 0 ) {
						if ( this.loop == 1 ) {
							this.decay = 15;
						}
					} else {
						this.decay = this.decay - 1;
					}
				} else {
					this.divider = this.divider - 1;
				}
			}
		};
	}

	function length_counter() {
		this.enabled = 0;
		this.halt    = 0;

		this.mute = 0;

		this.i = 0;
	}

	length_counter.prototype.step = function() {
		if ( this.enabled == 0 || this.halt == 1 ) {
			return;
		}

		if ( this.i == 0 ) {
			this.mute = 1;
		} else {
			this.i = this.i - 1;
		}
	};

	length_counter.prototype.set_enabled = function( value ) {
		this.enabled = value;
		
		if ( value == 0 ) {
			this.i = 0;
		}
	};

	function sweep() {
		this.enabled        = 0;
		this.divider_period = 0;
		this.negate         = 0;
		this.shift          = 0;

		this.reload = 0;

		this.i = 0;
	}

	sweep.prototype.step = function() {
		if ( this.i == 0 ) {
			// TODO ? 
		}

		if ( this.i == 0 || this.reload == 1 ) {
			this.i = this.divider_period;
			this.reload = 0;
		} else {
			this.i = this.i - 1;
		}
	}

	function pulse_channel( offset ) {
		this.offset = offset;

		this.gain = 0;
		this.frequency = 0;

		this.duty = 0;
		this.timer = 0;

		this.envelope = new envelope();
		this.length_counter = new length_counter();
		this.sweep = new sweep();
	}

	pulse_channel.prototype.update_gain = function() {
		var result = 1.0;

		if ( this.length_counter.enabled == 0 ) {
			result = 0.0;
		}

		if ( ( this.length_counter.enabled == 1 && this.length_counter.mute == 1 ) ) {
			result = 0.0;
		} else {
			if ( this.envelope.constant_volume == 0 ) {
				result = result * this.envelope.decay / 15;
			} else {
				result = result * this.envelope.divider_period / 15;
			}
		}

		// sweep unit mutes

		if ( this.period_target > 0x7ff ) {
			result = 0.0;
		}

		// TODO unclear if + 1 is correct

		if ( this.timer + 1 < 8 ) {
			result = 0.0;
		}

		this.gain = result
	};

	pulse_channel.prototype.update_frequency = function( wave_node ) {		
		var timer_delta = this.timer >> this.sweep.shift;
		
		if ( this.sweep.negate ) {
			timer_delta = timer_delta * -1;
		}
		
		if ( this.sweep.enabled == 0 ) {
			timer_delta = 0;
			this.period_target = this.timer + 1;
		} else {
			// this.period_target = this.timer + 1 + timer_delta;
			this.period_target = this.period_target + timer_delta;
		}

		this.frequency = ( 1789773 / 16 ) / this.period_target;

		if ( this.frequency != this.frequency_previous ) {
			wave_node.frequency.value = this.frequency;
		}

		if ( this.duty != this.duty_previous ) {
			wave_node.setPeriodicWave( app.audio.waves[ this.duty ] );
		}

		this.frequency_previous = this.frequency;
		this.duty_previous = this.duty;
	}

	pulse_channel.prototype.bus_write = function( address, value ) {
		switch ( address - this.offset ) {
			case 0:
				this.duty                     = ( value >> 6 ) & 0b0011;
				this.length_counter.halt      =
				this.envelope.loop            = ( value >> 5 ) & 0b0001;
				this.envelope.constant_volume = ( value >> 4 ) & 0b0001;
				this.envelope.divider_period  = ( value >> 0 ) & 0b1111;
				break;
			case 1:
				this.sweep.enabled = ( value >> 7 ) & 0b0001;
				this.sweep.period  = ( value >> 4 ) & 0b0111;
				this.sweep.negate  = ( value >> 3 ) & 0b0001;
				this.sweep.shift   = ( value >> 0 ) & 0b0111;
				break;
			case 2:
				this.timer = ( this.timer & 0b11100000000 ) | ( value & 0b00011111111 );
				this.period_target = this.timer + 1;
				break;
			case 3:
				this.length_counter.i  = get_length( ( value >> 3 ) & 0b11111 );
				this.length_counter.mute = 0;

				// TODO I think only this actually sets timer, lo byte is cold input
				var timer_hi = value & 0b111;
				this.timer = ( this.timer & 0b00011111111 ) | ( timer_hi << 8 );
				this.period_target = this.timer + 1;

				this.envelope.start = 1;
				// todo reset phase of pulse
				break;

		}
	};

	function triangle_channel( offset ) {
		this.offset = offset;

		this.gain = 0;
		this.frequency = 0;

		this.timer = 0;

		this.length_counter = new length_counter();

		this.linear_counter = 0;
		this.linear_counter_reload = 1;
		this.linear_counter_i = 0;

		this.bus_write = function( address, value ) {
			switch( address - this.offset ) {
				case 0:
					this.length_counter.halt = ( value >> 7 ) & 1;
					this.linear_counter = ( value >> 0 ) & 0b1111111;
					break;
				case 1:
					break;
				case 2:
					this.timer = ( this.timer & 0b11100000000 ) | ( value & 0b00011111111 );
				case 3:
					this.length_counter.i  = get_length( ( value >> 3 ) & 0b11111 );
					this.length_counter.mute = 0;

					var timer_hi = value & 0b111;
					this.timer = ( this.timer & 0b00011111111 ) | ( timer_hi << 8 );
					this.linear_counter_reload = 1;
					break;
			}
		};
	}

	triangle_channel.prototype.step_linear_counter = function() {
		if ( this.linear_counter_reload == 1 ) {
			this.linear_counter_reload = 0;
			this.linear_counter_i = this.linear_counter;
		} else {
			if ( this.linear_counter_i != 0 ) {
				this.linear_counter_i = this.linear_counter_i - 1;
			}
		}
	};

	triangle_channel.prototype.update_gain = function() {
		var result = 1.0;

		if ( this.length_counter.enabled == 0 ) {
			result = 0.0;
		}

		if ( this.length_counter.enabled == 1 && this.length_counter.mute == 1 ) {
			result = 0.0;
		}

		if ( this.length_counter.enabled == 1 && this.linear_counter_i == 0 ) {
			result = 0.0;
		}

		if ( this.timer < 2 ) {
			result = 0.0;
		}

		this.gain = result
	};

	triangle_channel.prototype.update_frequency = function( wave_node ) {
		this.frequency = ( 1789773 / 32 ) / ( this.timer + 1 )

		if ( this.frequency != this.frequency_previous ) {
			wave_node.frequency.value = this.frequency;
		}

		this.frequency_previous = this.frequency;
	};

	function noise_channel() {

	}

	this.channels = [
		new pulse_channel(    0x4000 ),
		new pulse_channel(    0x4004 ),
		new triangle_channel( 0x4008 ),
		new noise_channel(    0x400c ),
	];

	this.bus_read = function( address ) {
		switch ( address )  {
			case 0x4016:
				var temp = 0;

				switch ( true ) {
					case ( this.pad_i < 8 ) :
						temp = this.pad[ 0 ][ this.pad_i ];
						break;
					case ( this.pad_i == 19 ) :
						temp = 1;
					default :
						temp = 0;
				}

				if ( this.strobe == 0 ) { this.pad_i = this.pad_i + 1; this.pad_i = this.pad_i % 24; }

				return  temp;
				// NOTE
				// When no controller is connected, the corresponding status bit will report 0. 

				// TODO fallthru if READ (value = null)

			case 0x4017:
				// NOTE copied from above
				var temp = 0;

				switch ( true ) {
					case ( this.pad_i < 8 ) :
						temp = this.pad[ 1 ][ this.pad_i ];
						if ( temp != 0 ) {
							console.log( "pad " + button_names[ this.pad_i ] + "(" + this.pad_i + ") = " + hex( temp, 2 ) );
						}
						break;
					case ( this.pad_i == 19 ) :
						temp = 1;
					default :
						temp = 0;;
				}

				if ( this.strobe == 0 ) { this.pad_i = this.pad_i + 1; this.pad_i = this.pad_i % 24; }

				return  temp;
		}

		return 0;
	}

	this.bus_write = function( address, value = null ) {
		var channel = 1;

		switch ( address )  {
			case 0x4000:
			case 0x4001:
			case 0x4002:
			case 0x4003:
				this.channels[ 0 ].bus_write( address, value );
				break;
			case 0x4004:
			case 0x4005:
			case 0x4006:
			case 0x4007:
				this.channels[ 1 ].bus_write( address, value );
				break;

			case 0x4008:
			case 0x4009:
			case 0x400A:
			case 0x400B:
				this.channels[ 2 ].bus_write( address, value );
				break;
			
			case 0x400C: break;
			// 400D
			case 0x400E: break;
			case 0x400F: break;
			case 0x4010: break;
			case 0x4011: break;
			case 0x4012: break;
			case 0x4013: break;
			case 0x4014: break;

			case 0x4015:
				// TODO "The triangle's linear counter works differently, and does silence the channel when it reaches zero.""
				this.channels[ 0 ].length_counter.set_enabled( ( value >> 0 ) & 1 );
				this.channels[ 1 ].length_counter.set_enabled( ( value >> 1 ) & 1 );
				this.channels[ 2 ].length_counter.set_enabled( ( value >> 2 ) & 1 );
				// this.channels[ 3 ].length_counter.set_enabled( ( value >> 3 ) & 1 );

				break;

			case 0x4016:
				value = value & 0b111;
				
				if ( this.strobe == 1 && value == 0 ) {
					update_pad();
					this.pad_i = 0;
				}

				this.strobe = value;

				break;

			case 0x4017:
				// TODO "Writing to $4017 with bit 7 set ($80) will immediately clock all of its controlled units at the beginning of the 5-step sequence; with bit 7 clear, only the sequence is reset without clocking any of its units."
				this.frame_counter.mode = ( value >> 7 ) & 1;
				this.frame_counter.i    = 0;
				this.irq_inhibit        = ( value >> 6 ) & 1;
				
				break;
		}

		return 0;
	}
}

function get_length( byte ) {
	switch( byte ) {
		case 0x1F : return  30;
		case 0x1D : return  28;
		case 0x1B : return  26;
		case 0x19 : return  24;
		case 0x17 : return  22;
		case 0x15 : return  20;
		case 0x13 : return  18;
		case 0x11 : return  16;
		case 0x0F : return  14;
		case 0x0D : return  12;
		case 0x0B : return  10;
		case 0x09 : return   8;
		case 0x07 : return   6;
		case 0x05 : return   4;
		case 0x03 : return   2;
		case 0x01 : return 254;
		
		case 0x1E : return  32;
		case 0x1C : return  16;
		case 0x1A : return  72;
		case 0x18 : return 192;
		case 0x16 : return  96;
		case 0x14 : return  48;
		case 0x12 : return  24;
		case 0x10 : return  12;
		
		case 0x0E : return  26;
		case 0x0C : return  14;
		case 0x0A : return  60;
		case 0x08 : return 160;
		case 0x06 : return  80;
		case 0x04 : return  40;
		case 0x02 : return  20;
		case 0x00 : return  10;
	}
}