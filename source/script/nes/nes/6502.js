"use strict";

const MODE_IMP =  0;
const MODE_REL =  1;
const MODE_ACC =  2;
const MODE_IMM =  3;
const MODE_ABS =  4;
const MODE_ABX =  5;
const MODE_ABY =  6;
const MODE_ZPA =  7;
const MODE_ZPX =  8;
const MODE_ZPY =  9;
const MODE_IND = 10;
const MODE_IZX = 11;
const MODE_IZY = 12;

function mode_to_string( mode ) {
	switch( mode ) {
		case MODE_IMP: return "IMP";
		case MODE_REL: return "REL";
		case MODE_ACC: return "ACC";
		case MODE_IMM: return "IMM";
		case MODE_ABS: return "ABS";
		case MODE_ABX: return "ABX";
		case MODE_ABY: return "ABY";
		case MODE_ZPA: return "ZPA";
		case MODE_ZPX: return "ZPX";
		case MODE_ZPY: return "ZPY";
		case MODE_IND: return "IND";
		case MODE_IZX: return "IZX";
		case MODE_IZY: return "IZY";
	}

	return "ERR"
}


const CODE_ADC =  0
const CODE_AND =  1
const CODE_ASL =  2
const CODE_BCC =  3
const CODE_BCS =  4
const CODE_BEQ =  5
const CODE_BIT =  6
const CODE_BMI =  7
const CODE_BNE =  8
const CODE_BPL =  9
const CODE_BRK = 10
const CODE_BVC = 11
const CODE_BVS = 12
const CODE_CLC = 13
const CODE_CLD = 14
const CODE_CLI = 15
const CODE_CLV = 16
const CODE_CMP = 17
const CODE_CPX = 18
const CODE_CPY = 19
const CODE_DEC = 20
const CODE_DEX = 21
const CODE_DEY = 22
const CODE_EOR = 23
const CODE_INC = 24
const CODE_INX = 25
const CODE_INY = 26
const CODE_JMP = 27
const CODE_JSR = 28
const CODE_LDA = 29
const CODE_LDX = 30
const CODE_LDY = 31
const CODE_LSR = 32
const CODE_NOP = 33
const CODE_ORA = 34
const CODE_PHA = 35
const CODE_PHP = 36
const CODE_PLA = 37
const CODE_PLP = 38
const CODE_ROL = 39
const CODE_ROR = 40
const CODE_RTI = 41
const CODE_RTS = 42
const CODE_SBC = 43
const CODE_SEC = 44
const CODE_SED = 45
const CODE_SEI = 46
const CODE_STA = 47
const CODE_STX = 48
const CODE_STY = 49
const CODE_TAX = 50
const CODE_TAY = 51
const CODE_TSX = 52
const CODE_TXA = 53
const CODE_TXS = 54
const CODE_TYA = 55

function code_to_string( code ) {
	switch ( code ) {
		case CODE_ADC: return "ADC";
		case CODE_AND: return "AND";
		case CODE_ASL: return "ASL";
		case CODE_BCC: return "BCC";
		case CODE_BCS: return "BCS";
		case CODE_BEQ: return "BEQ";
		case CODE_BIT: return "BIT";
		case CODE_BMI: return "BMI";
		case CODE_BNE: return "BNE";
		case CODE_BPL: return "BPL";
		case CODE_BRK: return "BRK";
		case CODE_BVC: return "BVC";
		case CODE_BVS: return "BVS";
		case CODE_CLC: return "CLC";
		case CODE_CLD: return "CLD";
		case CODE_CLI: return "CLI";
		case CODE_CLV: return "CLV";
		case CODE_CMP: return "CMP";
		case CODE_CPX: return "CPX";
		case CODE_CPY: return "CPY";
		case CODE_DEC: return "DEC";
		case CODE_DEX: return "DEX";
		case CODE_DEY: return "DEY";
		case CODE_EOR: return "EOR";
		case CODE_INC: return "INC";
		case CODE_INX: return "INX";
		case CODE_INY: return "INY";
		case CODE_JMP: return "JMP";
		case CODE_JSR: return "JSR";
		case CODE_LDA: return "LDA";
		case CODE_LDX: return "LDX";
		case CODE_LDY: return "LDY";
		case CODE_LSR: return "LSR";
		case CODE_NOP: return "NOP";
		case CODE_ORA: return "ORA";
		case CODE_PHA: return "PHA";
		case CODE_PHP: return "PHP";
		case CODE_PLA: return "PLA";
		case CODE_PLP: return "PLP";
		case CODE_ROL: return "ROL";
		case CODE_ROR: return "ROR";
		case CODE_RTI: return "RTI";
		case CODE_RTS: return "RTS";
		case CODE_SBC: return "SBC";
		case CODE_SEC: return "SEC";
		case CODE_SED: return "SED";
		case CODE_SEI: return "SEI";
		case CODE_STA: return "STA";
		case CODE_STX: return "STX";
		case CODE_STY: return "STY";
		case CODE_TAX: return "TAX";
		case CODE_TAY: return "TAY";
		case CODE_TSX: return "TSX";
		case CODE_TXA: return "TXA";
		case CODE_TXS: return "TXS";
		case CODE_TYA: return "TYA";
	}

	return "ERR";
}

function byte_to_code( byte ) {
	switch( byte ) {
		case 0x00: return [ CODE_BRK, MODE_IMP ];
		case 0x01: return [ CODE_ORA, MODE_IZX ];
		case 0x05: return [ CODE_ORA, MODE_ZPA ];
		case 0x06: return [ CODE_ASL, MODE_ZPA ];
		case 0x08: return [ CODE_PHP, MODE_IMP ];
		case 0x09: return [ CODE_ORA, MODE_IMM ];
		case 0x0A: return [ CODE_ASL, MODE_ACC ];
		case 0x0D: return [ CODE_ORA, MODE_ABS ];
		case 0x0E: return [ CODE_ASL, MODE_ABS ];
		case 0x10: return [ CODE_BPL, MODE_REL ];
		case 0x11: return [ CODE_ORA, MODE_IZY ];
		case 0x15: return [ CODE_ORA, MODE_ZPX ];
		case 0x16: return [ CODE_ASL, MODE_ZPX ];
		case 0x18: return [ CODE_CLC, MODE_IMP ];
		case 0x19: return [ CODE_ORA, MODE_ABY ];
		case 0x1D: return [ CODE_ORA, MODE_ABX ];
		case 0x1E: return [ CODE_ASL, MODE_ABX ];
		case 0x20: return [ CODE_JSR, MODE_ABS ];
		case 0x21: return [ CODE_AND, MODE_IZX ];
		case 0x24: return [ CODE_BIT, MODE_ZPA ];
		case 0x25: return [ CODE_AND, MODE_ZPA ];
		case 0x26: return [ CODE_ROL, MODE_ZPA ];
		case 0x28: return [ CODE_PLP, MODE_IMP ];
		case 0x29: return [ CODE_AND, MODE_IMM ];
		case 0x2A: return [ CODE_ROL, MODE_ACC ];
		case 0x2C: return [ CODE_BIT, MODE_ABS ];
		case 0x2D: return [ CODE_AND, MODE_ABS ];
		case 0x2E: return [ CODE_ROL, MODE_ABS ];
		case 0x30: return [ CODE_BMI, MODE_REL ];
		case 0x31: return [ CODE_AND, MODE_IZY ];
		case 0x35: return [ CODE_AND, MODE_ZPX ];
		case 0x36: return [ CODE_ROL, MODE_ZPX ];
		case 0x38: return [ CODE_SEC, MODE_IMP ];
		case 0x39: return [ CODE_AND, MODE_ABY ];
		case 0x3D: return [ CODE_AND, MODE_ABX ];
		case 0x3E: return [ CODE_ROL, MODE_ABX ];
		case 0x40: return [ CODE_RTI, MODE_IMP ];
		case 0x41: return [ CODE_EOR, MODE_IZX ];
		case 0x45: return [ CODE_EOR, MODE_ZPA ];
		case 0x46: return [ CODE_LSR, MODE_ZPA ];
		case 0x48: return [ CODE_PHA, MODE_IMP ];
		case 0x49: return [ CODE_EOR, MODE_IMM ];
		case 0x4A: return [ CODE_LSR, MODE_ACC ];
		case 0x4C: return [ CODE_JMP, MODE_ABS ];
		case 0x4D: return [ CODE_EOR, MODE_ABS ];
		case 0x4E: return [ CODE_LSR, MODE_ABS ];
		case 0x50: return [ CODE_BVC, MODE_REL ];
		case 0x51: return [ CODE_EOR, MODE_IZY ];
		case 0x55: return [ CODE_EOR, MODE_ZPX ];
		case 0x56: return [ CODE_LSR, MODE_ZPX ];
		case 0x58: return [ CODE_CLI, MODE_IMP ];
		case 0x59: return [ CODE_EOR, MODE_ABY ];
		case 0x5D: return [ CODE_EOR, MODE_ABX ];
		case 0x5E: return [ CODE_LSR, MODE_ABX ];
		case 0x60: return [ CODE_RTS, MODE_IMP ];
		case 0x61: return [ CODE_ADC, MODE_IZX ];
		case 0x65: return [ CODE_ADC, MODE_ZPA ];
		case 0x66: return [ CODE_ROR, MODE_ZPA ];
		case 0x68: return [ CODE_PLA, MODE_IMP ];
		case 0x69: return [ CODE_ADC, MODE_IMM ];
		case 0x6A: return [ CODE_ROR, MODE_ACC ];
		case 0x6C: return [ CODE_JMP, MODE_IND ];
		case 0x6D: return [ CODE_ADC, MODE_ABS ];
		case 0x6E: return [ CODE_ROR, MODE_ABS ];
		case 0x70: return [ CODE_BVS, MODE_REL ];
		case 0x71: return [ CODE_ADC, MODE_IZY ];
		case 0x75: return [ CODE_ADC, MODE_ZPX ];
		case 0x76: return [ CODE_ROR, MODE_ZPX ];
		case 0x78: return [ CODE_SEI, MODE_IMP ];
		case 0x79: return [ CODE_ADC, MODE_ABY ];
		case 0x7D: return [ CODE_ADC, MODE_ABX ];
		case 0x7E: return [ CODE_ROR, MODE_ABX ];
		case 0x81: return [ CODE_STA, MODE_IZX ];
		case 0x84: return [ CODE_STY, MODE_ZPA ];
		case 0x85: return [ CODE_STA, MODE_ZPA ];
		case 0x86: return [ CODE_STX, MODE_ZPA ];
		case 0x88: return [ CODE_DEY, MODE_IMP ];
		case 0x8A: return [ CODE_TXA, MODE_IMP ];
		case 0x8C: return [ CODE_STY, MODE_ABS ];
		case 0x8D: return [ CODE_STA, MODE_ABS ];
		case 0x8E: return [ CODE_STX, MODE_ABS ];
		case 0x90: return [ CODE_BCC, MODE_REL ];
		case 0x91: return [ CODE_STA, MODE_IZY ];
		case 0x94: return [ CODE_STY, MODE_ZPX ];
		case 0x95: return [ CODE_STA, MODE_ZPX ];
		case 0x96: return [ CODE_STX, MODE_ZPY ];
		case 0x98: return [ CODE_TYA, MODE_IMP ];
		case 0x99: return [ CODE_STA, MODE_ABY ];
		case 0x9A: return [ CODE_TXS, MODE_IMP ];
		case 0x9D: return [ CODE_STA, MODE_ABX ];
		case 0xA0: return [ CODE_LDY, MODE_IMM ];
		case 0xA1: return [ CODE_LDA, MODE_IZX ];
		case 0xA2: return [ CODE_LDX, MODE_IMM ];
		case 0xA4: return [ CODE_LDY, MODE_ZPA ];
		case 0xA5: return [ CODE_LDA, MODE_ZPA ];
		case 0xA6: return [ CODE_LDX, MODE_ZPA ];
		case 0xA8: return [ CODE_TAY, MODE_IMP ];
		case 0xA9: return [ CODE_LDA, MODE_IMM ];
		case 0xAA: return [ CODE_TAX, MODE_IMP ];
		case 0xAC: return [ CODE_LDY, MODE_ABS ];
		case 0xAD: return [ CODE_LDA, MODE_ABS ];
		case 0xAE: return [ CODE_LDX, MODE_ABS ];
		case 0xB0: return [ CODE_BCS, MODE_REL ];
		case 0xB1: return [ CODE_LDA, MODE_IZY ];
		case 0xB4: return [ CODE_LDY, MODE_ZPX ];
		case 0xB5: return [ CODE_LDA, MODE_ZPX ];
		case 0xB6: return [ CODE_LDX, MODE_ZPY ];
		case 0xB8: return [ CODE_CLV, MODE_IMP ];
		case 0xB9: return [ CODE_LDA, MODE_ABY ];
		case 0xBA: return [ CODE_TSX, MODE_IMP ];
		case 0xBC: return [ CODE_LDY, MODE_ABX ];
		case 0xBD: return [ CODE_LDA, MODE_ABX ];
		case 0xBE: return [ CODE_LDX, MODE_ABY ];
		case 0xC0: return [ CODE_CPY, MODE_IMM ];
		case 0xC1: return [ CODE_CMP, MODE_IZX ];
		case 0xC4: return [ CODE_CPY, MODE_ZPA ];
		case 0xC5: return [ CODE_CMP, MODE_ZPA ];
		case 0xC6: return [ CODE_DEC, MODE_ZPA ];
		case 0xC8: return [ CODE_INY, MODE_IMP ];
		case 0xC9: return [ CODE_CMP, MODE_IMM ];
		case 0xCA: return [ CODE_DEX, MODE_IMP ];
		case 0xCC: return [ CODE_CPY, MODE_ABS ];
		case 0xCD: return [ CODE_CMP, MODE_ABS ];
		case 0xCE: return [ CODE_DEC, MODE_ABS ];
		case 0xD0: return [ CODE_BNE, MODE_REL ];
		case 0xD1: return [ CODE_CMP, MODE_IZY ];
		case 0xD5: return [ CODE_CMP, MODE_ZPX ];
		case 0xD6: return [ CODE_DEC, MODE_ZPX ];
		case 0xD8: return [ CODE_CLD, MODE_IMP ];
		case 0xD9: return [ CODE_CMP, MODE_ABY ];
		case 0xDD: return [ CODE_CMP, MODE_ABX ];
		case 0xDE: return [ CODE_DEC, MODE_ABX ];
		case 0xE0: return [ CODE_CPX, MODE_IMM ];
		case 0xE1: return [ CODE_SBC, MODE_IZX ];
		case 0xE4: return [ CODE_CPX, MODE_ZPA ];
		case 0xE5: return [ CODE_SBC, MODE_ZPA ];
		case 0xE6: return [ CODE_INC, MODE_ZPA ];
		case 0xE8: return [ CODE_INX, MODE_IMP ];
		case 0xE9: return [ CODE_SBC, MODE_IMM ];
		case 0xEA: return [ CODE_NOP, MODE_IMP ];
		case 0xEC: return [ CODE_CPX, MODE_ABS ];
		case 0xED: return [ CODE_SBC, MODE_ABS ];
		case 0xEE: return [ CODE_INC, MODE_ABS ];
		case 0xF0: return [ CODE_BEQ, MODE_REL ];
		case 0xF1: return [ CODE_SBC, MODE_IZY ];
		case 0xF5: return [ CODE_SBC, MODE_ZPX ];
		case 0xF6: return [ CODE_INC, MODE_ZPX ];
		case 0xF8: return [ CODE_SED, MODE_IMP ];
		case 0xF9: return [ CODE_SBC, MODE_ABY ];
		case 0xFD: return [ CODE_SBC, MODE_ABX ];
		case 0xFE: return [ CODE_INC, MODE_ABX ];
	}

	return [ -1, -1 ];
}

export function byte_to_asm( byte) {
	let [ code, mode ] = byte_to_code( byte );

	var value = 0
	let address = 0;

	var temp, temp_2, temp_3;

	let paged = 0;

	switch ( mode ) {
		case MODE_ACC:
		// value = this.a;
		break;

		case MODE_IMM:
		// value = nes.bus_read( this.pc + 1 );
		break;

		case MODE_ZPA:
		// address = nes.bus_read( this.pc + 1 );
		break;

		case MODE_ZPX:
		// address = nes.bus_read( this.pc + 1 );
		// address = ( address + this.x ) & 0x00ff;
		break;

		case MODE_ZPY:
		// address = nes.bus_read( this.pc + 1 );
		// address = ( address + this.y ) & 0x00ff;
		break;

		case MODE_REL:
		// var d = nes.bus_read( this.pc + 1 );
		// var e = 2;

		// if ( d >> 7 == 1 ) {
			// d = ~ d;
			// d = d & 0xff;
			// d = d * -1;
			// d = d + 1;
			// d = d - 2;
		// }

		// address = this.pc + d;
		break;

		case MODE_ABS :
		// address = this.get_2( this.pc + 1 );
		break;

		case MODE_ABX :
		// temp = this.get_2( this.pc + 1 );
		// address = ( temp + this.x ) & 0xffff;
		// if ( ( temp & 0xFF00 ) != ( address & 0xFF00 ) ) { paged = 1; }
		break;

		case MODE_ABY :
		// temp = address = this.get_2( this.pc + 1 );
		// address = ( temp + this.y ) & 0xffff;
		// if ( ( temp & 0xFF00 ) != ( address & 0xFF00 ) ) { paged = 1; }
		break;

		case MODE_IND :
		// temp = address = this.get_2( this.pc + 1 );

		function get_2_temp( i, mask = 0xffff ) {
			var page = i & 0xFF00;
			var j = i + 1;
			if ( j == page + 0x0100 ) j = page;
			var lo = nes.bus_read( j & mask ) << 8;
			var hi = nes.bus_read( i & mask );
			return lo | hi;
		}

		// address = get_2_temp( temp );
		break;

		case MODE_IZX :
		// temp = nes.bus_read( this.pc + 1 );
		// temp_2  = ( temp + this.x ) & 0x00ff;
		// address = get_2_temp( temp_2, 0x00ff );
		break;

		case MODE_IZY :
		// temp = nes.bus_read( this.pc + 1 );
		// if ( temp == 0xff ) paged += 1;
		// temp_2 = get_2_temp( temp, 0x00ff );
		// temp_3 = ( temp_2 + this.y );
		// address = temp_3 & 0xffff
		// if ( address != temp_3 ) { paged += 1; }
		break;
	}

	let cost = 0, size = 0;

	function cost_0() {
		switch ( mode ) {
			case MODE_ACC : size = 1; cost = 2;         break;
			case MODE_IMM : size = 2; cost = 2;         break;
			case MODE_ZPA : size = 2; cost = 3;         break;
			case MODE_ZPX : size = 2; cost = 4;         break;
			case MODE_ZPY : size = 2; cost = 4;         break;
			case MODE_ABS : size = 3; cost = 4;         break;
			case MODE_ABX : size = 3; cost = 4 + paged; break;
			case MODE_ABY : size = 3; cost = 4 + paged; break;
			case MODE_IZX : size = 2; cost = 6;         break;
			case MODE_IZY : size = 2; cost = 5 + paged; break;
		}
	}

	function cost_1() {
		paged = 1;
		cost_0();
	}

	function cost_2() {
		paged = 1;
		cost_0();
		cost = cost + 2;
		if ( mode == MODE_ACC ) { cost = 2; }
	}

	function cost_5() {
		size = 3;

		switch ( mode ) {
			case MODE_ABS : cost = 3; break;
			case MODE_IND : cost = 5; break;
		}
	}

	function branch( /* condition */ ) {
		cost = 2;
		size = 2;

// 		if ( condition ) {
// 			cost = cost + 1;
// 			if ( self.pc & 0xff00 != address & 0xff00 ) { cost = cost + 2; }
// 			self.pc = address;
// 		}
	}

	switch ( code ) {
		case CODE_LDA: cost_0(); break;
		case CODE_LDX: cost_0(); break;
		case CODE_LDY: cost_0(); break;

		case CODE_STA: cost_1(); break;
		case CODE_STX: cost_1(); break;
		case CODE_STY: cost_1(); break;

		case CODE_TAX: size = 1; cost = 2; break;
		case CODE_TAY: size = 1; cost = 2; break;
		case CODE_TXA: size = 1; cost = 2; break;
		case CODE_TYA: size = 1; cost = 2; break;

		case CODE_TSX: size = 1; cost = 2; break;
		case CODE_TXS: size = 1; cost = 2; break;
		case CODE_PLA: size = 1; cost = 4; break;
		case CODE_PHA: size = 1; cost = 3; break;
		case CODE_PLP: size = 1; cost = 4; break;
		case CODE_PHP: size = 1; cost = 3; break;

		case CODE_AND: cost_0(); break;
		case CODE_EOR: cost_0(); break;
		case CODE_ORA: cost_0(); break;
		case CODE_BIT: cost_0(); break;
		case CODE_SBC:
		case CODE_ADC: cost_0(); break;
		case CODE_CMP: cost_0(); break;
		case CODE_CPX: cost_0(); break;
		case CODE_CPY: cost_0(); break;
		case CODE_INC: cost_2(); break;
		case CODE_INX: size = 1; cost = 2; break;
		case CODE_INY: size = 1; cost = 2; break;

		case CODE_DEC: cost_2(); break;
		case CODE_DEX: size = 1; cost = 2; break;
		case CODE_DEY: size = 1; cost = 2; break;
		case CODE_ASL: cost_2(); break;
		case CODE_LSR: cost_2(); break;
		case CODE_ROL: cost_2(); break;
		case CODE_ROR: cost_2(); break;
		case CODE_JMP: size = 3; cost_5(); break;
		case CODE_JSR: size = 3; cost = 6; break;
		case CODE_RTS: size = 1; cost = 6; break;

		case CODE_BCC : branch(); break;
		case CODE_BCS : branch(); break;
		case CODE_BEQ : branch(); break;
		case CODE_BMI : branch(); break;
		case CODE_BNE : branch(); break;
		case CODE_BPL : branch(); break;
		case CODE_BVC : branch(); break;
		case CODE_BVS : branch(); break;

		case CODE_CLC: size = 1; cost = 2; break;
		case CODE_CLD: size = 1; cost = 2; break;
		case CODE_CLI: size = 1; cost = 2; break;
		case CODE_CLV: size = 1; cost = 2; break;
		case CODE_SEC: size = 1; cost = 2; break;
		case CODE_SED: size = 1; cost = 2; break;
		case CODE_SEI: size = 1; cost = 2; break;

		case CODE_BRK: size = 1; cost = 7; break;
		case CODE_NOP: size = 1; cost = 2; break;
		case CODE_RTI: size = 1; cost = 6; break;
	}


	return [ code_to_string( code ), mode_to_string( mode ), size ];
}















export function code_step( pc, byte ) {
		function update_nz() {
			self.p_z = value == 0 ? 1 : 0;
			self.p_n = ( value >> 7 ) & 1;
		}

		function stack_pull() {
			self.s = ( self.s + 1 ) & 0xff;
			var temp = nes.bus_read( 0x0100 + self.s );

			return temp;
		}

		function stack_push( value ) {
			nes.bus_write( 0x0100 + self.s, value );
			self.s = ( self.s - 1 ) & 0xff;
		}

		// TODO rename push_status

		function pull_flags() {
			var temp = stack_pull();
			self.p_c = ( temp >> 0 ) & 1;
			self.p_z = ( temp >> 1 ) & 1;
			self.p_i = ( temp >> 2 ) & 1;
			self.p_d = ( temp >> 3 ) & 1;
			self.p_v = ( temp >> 6 ) & 1;
			self.p_n = ( temp >> 7 ) & 1;
		}

		function pack_flags( b, fill = 1 ) {
			var temp = 0;
			temp = temp | ( self.p_c << 0 );
			temp = temp | ( self.p_z << 1 );
			temp = temp | ( self.p_i << 2 );
			temp = temp | ( self.p_d << 3 );
			temp = temp | (        b << 4 );
			temp = temp | (     fill << 5 );
			temp = temp | ( self.p_v << 6 );
			temp = temp | ( self.p_n << 7 );
			return temp;
		}

		function push_flags( b ) {
			var temp = pack_flags( b );
			stack_push( temp );
		}

		function pull_pc( size = 1 ) {
			var lo = stack_pull();
			var hi = stack_pull() << 8;
			self.pc = ( lo | hi ) - size;
		}

		function push_pc( size = 1 ) {
			var address = self.pc + size - 1;

			var lo = ( address >> 0 ) & 0xff;
			var hi = ( address >> 8 ) & 0xff;

			stack_push( hi );
			stack_push( lo );
		}

		var instruction;
		var mode;
		var value, address, cost, size;
		var paged = 0; // TODO

		var byte = nes.bus_read( this.pc );
		[ instruction, mode ] = get_instruction( byte );
		this.instruction = instruction;

		var temp, temp_2, temp_3;

		switch ( mode ) {
			case MODE_ACC :
			value = this.a;
			break;

			case MODE_IMM :
			value = nes.bus_read( this.pc + 1 );
			break;

			case MODE_ZPA :
			address = nes.bus_read( this.pc + 1 );
			break;
			case MODE_ZPX :
			address = nes.bus_read( this.pc + 1 );
			// temp = address;
			address = ( address + this.x ) & 0x00ff;
			break;

			case MODE_ZPY :
			address = nes.bus_read( this.pc + 1 );
			// temp = address;
			address = ( address + this.y ) & 0x00ff;
			break;

			case MODE_REL :
			var d = nes.bus_read( this.pc + 1 );
			var e = 2;

			if ( d >> 7 == 1 ) {
				d = ~ d;
				d = d & 0xff;
				d = d * -1;
				d = d + 1;
				d = d - 2;
			}

			address = this.pc + d;
			break;

			case MODE_ABS :
			address = this.get_2( this.pc + 1 );
			break;

			case MODE_ABX :
			temp = this.get_2( this.pc + 1 );
			address = ( temp + this.x ) & 0xffff;
			if ( ( temp & 0xFF00 ) != ( address & 0xFF00 ) ) { paged = 1; }
			break;

			case MODE_ABY :
			temp = address = this.get_2( this.pc + 1 );
			address = ( temp + this.y ) & 0xffff;
			if ( ( temp & 0xFF00 ) != ( address & 0xFF00 ) ) { paged = 1; }
			break;

			case MODE_IND :
			temp = address = this.get_2( this.pc + 1 );

			function get_2_temp( i, mask = 0xffff ) {
				var page = i & 0xFF00;
				var j = i + 1;
				if ( j == page + 0x0100 ) { j = page; }
				var lo = nes.bus_read( j & mask ) << 8;
				var hi = nes.bus_read( i & mask );
				return lo | hi;
			}

			address = get_2_temp( temp );
			break;

			case MODE_IZX :
			temp = nes.bus_read( this.pc + 1 );
			temp_2  = ( temp + this.x ) & 0x00ff;

			address = get_2_temp( temp_2, 0x00ff );
			break;

			case MODE_IZY :
			temp = nes.bus_read( this.pc + 1 );
			if ( temp == 0xff ) { paged += 1; }

			temp_2 = get_2_temp( temp, 0x00ff );
			temp_3 = ( temp_2 + this.y );
			address = temp_3 & 0xffff

			if ( address != temp_3 ) { paged += 1; }
			break;
		}

		function cost_0() {
			switch ( mode ) {
				case MODE_ACC : size = 1; cost = 2;         break;
				case MODE_IMM : size = 2; cost = 2;         break;
				case MODE_ZPA : size = 2; cost = 3;         break;
				case MODE_ZPX : size = 2; cost = 4;         break;
				case MODE_ZPY : size = 2; cost = 4;         break;
				case MODE_ABS : size = 3; cost = 4;         break;
				case MODE_ABX : size = 3; cost = 4 + paged; break;
				case MODE_ABY : size = 3; cost = 4 + paged; break;
				case MODE_IZX : size = 2; cost = 6;         break;
				case MODE_IZY : size = 2; cost = 5 + paged; break;
			}
		}

		function cost_1() {
			paged = 1;
			cost_0();
		}

		function cost_2() {
			paged = 1;
			cost_0();
			cost = cost + 2;
			if ( mode == MODE_ACC ) { cost = 2; }
		}

		function cost_5() {
			size = 3;

			switch ( mode ) {
				case MODE_ABS : cost = 3; break;
				case MODE_IND : cost = 5; break;
			}
		}

		function branch( condition ) {
			cost = 2;
			size = 2;

			if ( condition ) {
				cost = cost + 1;
				if ( self.pc & 0xff00 != address & 0xff00 ) { cost = cost + 2; }
				self.pc = address;
			}
		}

		switch ( instruction ) {
			case INSTRUCTION_LDA: if ( value == undefined ) { value = nes.bus_read( address ); } this.a = value; update_nz(); cost_0(); break;
			case INSTRUCTION_LDX: if ( value == undefined ) { value = nes.bus_read( address ); } this.x = value; update_nz(); cost_0(); break;
			case INSTRUCTION_LDY: if ( value == undefined ) { value = nes.bus_read( address ); } this.y = value; update_nz(); cost_0(); break;

			case INSTRUCTION_STA: nes.bus_write( address, this.a ); cost_1(); break;
			case INSTRUCTION_STX: nes.bus_write( address, this.x ); cost_1(); break;
			case INSTRUCTION_STY: nes.bus_write( address, this.y ); cost_1(); break;

			case INSTRUCTION_TAX: value = this.a; this.x = value; update_nz(); size = 1; cost = 2; break;
			case INSTRUCTION_TAY: value = this.a; this.y = value; update_nz(); size = 1; cost = 2; break;
			case INSTRUCTION_TXA: value = this.x; this.a = value; update_nz(); size = 1; cost = 2; break;
			case INSTRUCTION_TYA: value = this.y; this.a = value; update_nz(); size = 1; cost = 2; break;

			case INSTRUCTION_TSX: value = this.s      ; this.x = value; update_nz(); size = 1; cost = 2; break;
			case INSTRUCTION_TXS: value = this.x      ; this.s = value;              size = 1; cost = 2; break;
			case INSTRUCTION_PLA: value = stack_pull(); this.a = value; update_nz(); size = 1; cost = 4; break;
			case INSTRUCTION_PHA: stack_push( this.a ); value = this.a;              size = 1; cost = 3; break;
			case INSTRUCTION_PLP: pull_flags();                                      size = 1; cost = 4; break;
			case INSTRUCTION_PHP: push_flags( 1 );                                   size = 1; cost = 3; break;

			case INSTRUCTION_AND: if ( value == undefined ) { value = nes.bus_read( address ); } value = this.a & value; this.a = value; update_nz(); cost_0(); break;
			case INSTRUCTION_EOR: if ( value == undefined ) { value = nes.bus_read( address ); } value = this.a ^ value; this.a = value; update_nz(); cost_0(); break;
			case INSTRUCTION_ORA: if ( value == undefined ) { value = nes.bus_read( address ); } value = this.a | value; this.a = value; update_nz(); cost_0(); break;

			case INSTRUCTION_BIT:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			temp = value;
			value = this.a & value;
			update_nz();
			this.p_v = ( temp >> 6 ) & 1;
			this.p_n = ( temp >> 7 ) & 1;
			cost_0();
			break;

			case INSTRUCTION_SBC:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			value = ( ~ value ) & 0xff;
			case INSTRUCTION_ADC :
			if ( value == undefined ) { value = nes.bus_read( address ); }
			temp = value;
			value = this.a + value + this.p_c;
			this.p_c = value > 0xff ? 1 : 0;
			value = value & 0xff;
			this.p_v = ( this.a & 0x80 ) == ( temp & 0x80 ) && ( this.a & 0x80 ) != ( value & 0x80 ) ? 1 : 0;
			this.a = value;
			update_nz();
			cost_0();
			break;

			case INSTRUCTION_CMP:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			value = this.a - value;
			this.p_c = value >= 0 ? 1 : 0;
			update_nz();
			cost_0();
			break;

			case INSTRUCTION_CPX:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			value = this.x - value;
			this.p_c = value >= 0 ? 1 : 0;
			update_nz();
			cost_0();
			break;

			case INSTRUCTION_CPY:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			value = this.y - value;
			this.p_c = value >= 0 ? 1 : 0;
			update_nz();
			cost_0();
			break;

			case INSTRUCTION_INC:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			value = ( value + 1 ) & 0xff;
			nes.bus_write( address, value );
			update_nz();
			cost_2();
			break;

			case INSTRUCTION_INX:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			value = ( this.x + 1 ) & 0xff;
			this.x = value;
			update_nz();
			size = 1;
			cost = 2;
			break;

			case INSTRUCTION_INY:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			value = ( this.y + 1 ) & 0xff;
			this.y = value;
			update_nz();
			size = 1;
			cost = 2;
			break;

			case INSTRUCTION_DEC:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			value = value - 1;
			nes.bus_write( address, value );
			update_nz();
			cost_2();
			break;

			case INSTRUCTION_DEX:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			value = ( this.x - 1 ) & 0xff;
			this.x = value;
			update_nz();
			size = 1;
			cost = 2;
			break;

			case INSTRUCTION_DEY:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			value = ( this.y - 1 ) & 0xff;
			this.y = value;
			update_nz();
			size = 1;
			cost = 2;
			break;

			case INSTRUCTION_ASL :
			if ( value == undefined ) { value = nes.bus_read( address ); }
			this.p_c = ( value & 0b10000000 ) >> 7;
			value = ( value << 1 ) & 0xff;

			if ( mode == MODE_ACC ) {
				this.a = value;
			} else {
				nes.bus_write( address, value );
			}

			update_nz();
			cost_2();
			break;

			case INSTRUCTION_LSR:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			this.p_c = ( value & 0b00000001 );
			value = ( value >> 1 );

			if ( mode == MODE_ACC ) {
				this.a = value;
			} else {
				nes.bus_write( address, value );
			}

			update_nz();
			cost_2();
			break;

			case INSTRUCTION_ROL:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			temp = this.p_c;
			this.p_c = ( value & 0b10000000 ) >> 7;
			value = ( value << 1 ) | temp;
			value = value & 0xff;

			if ( mode == MODE_ACC ) {
				this.a = value;
			} else {
				nes.bus_write( address, value );
			}

			update_nz();
			cost_2();
			break;

			case INSTRUCTION_ROR:
			if ( value == undefined ) { value = nes.bus_read( address ); }
			temp = this.p_c;
			this.p_c = ( value & 0b00000001 );
			value = ( value >> 1 ) | ( temp << 7 );

			if ( mode == MODE_ACC ) {
				this.a = value;
			} else {
				nes.bus_write( address, value );
			}

			update_nz();
			cost_2();
			break;

			case INSTRUCTION_JMP:
			this.pc = address - 3;
			size = 3;
			cost_5();
			break;

			case INSTRUCTION_JSR:
			size = 3;
			push_pc( size )
			this.pc = address - 3;
			cost = 6;
			break;

			case INSTRUCTION_RTS:
			size = 1;
			this.pc = ( ( stack_pull() ) | stack_pull() << 8 ) + 1 - size;
			cost = 6;
			break;

			case INSTRUCTION_BCC: branch( this.p_c == 0 ); break;
			case INSTRUCTION_BCS: branch( this.p_c == 1 ); break;
			case INSTRUCTION_BEQ: branch( this.p_z == 1 ); break;
			case INSTRUCTION_BMI: branch( this.p_n == 1 ); break;
			case INSTRUCTION_BNE: branch( this.p_z == 0 ); break;
			case INSTRUCTION_BPL: branch( this.p_n == 0 ); break;
			case INSTRUCTION_BVC: branch( this.p_v == 0 ); break;
			case INSTRUCTION_BVS: branch( this.p_v == 1 ); break;

			case INSTRUCTION_CLC: this.p_c = 0; size = 1; cost = 2; break;
			case INSTRUCTION_CLD: this.p_d = 0; size = 1; cost = 2; break;
			case INSTRUCTION_CLI: this.p_i = 0; size = 1; cost = 2; break;
			case INSTRUCTION_CLV: this.p_v = 0; size = 1; cost = 2; break;
			case INSTRUCTION_SEC: this.p_c = 1; size = 1; cost = 2; break;
			case INSTRUCTION_SED: this.p_d = 1; size = 1; cost = 2; break;
			case INSTRUCTION_SEI: this.p_i = 1; size = 1; cost = 2; break;

			// TODO verify;
			// TODO maybe combine with irq_pending value
			case INSTRUCTION_BRK:
			this.interrupt_pending = INTERRUPT_IRQ;
			this.p_b = 1;
			size = 1;
			cost = 7;
			break;

			case INSTRUCTION_NOP: size = 1; cost = 2; break;

			case INSTRUCTION_RTI:
			pull_flags();
			size = 1;
			pull_pc( size );
			cost = 6;
			break;
		}

		this.pc = this.pc + size;
		this.cycles += cost;
	}
