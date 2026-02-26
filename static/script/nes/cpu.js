"use strict";

const INTERRUPT_NONE  = 0;
const INTERRUPT_IRQ   = 1;
const INTERRUPT_NMI   = 2;
const INTERRUPT_RESET = 3;

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

var i = 0;
const INSTRUCTION_ADC = i; i += 1;
const INSTRUCTION_AND = i; i += 1;
const INSTRUCTION_ASL = i; i += 1;
const INSTRUCTION_BCC = i; i += 1;
const INSTRUCTION_BCS = i; i += 1;
const INSTRUCTION_BEQ = i; i += 1;
const INSTRUCTION_BIT = i; i += 1;
const INSTRUCTION_BMI = i; i += 1;
const INSTRUCTION_BNE = i; i += 1;
const INSTRUCTION_BPL = i; i += 1;
const INSTRUCTION_BRK = i; i += 1;
const INSTRUCTION_BVC = i; i += 1;
const INSTRUCTION_BVS = i; i += 1;
const INSTRUCTION_CLC = i; i += 1;
const INSTRUCTION_CLD = i; i += 1;
const INSTRUCTION_CLI = i; i += 1;
const INSTRUCTION_CLV = i; i += 1;
const INSTRUCTION_CMP = i; i += 1;
const INSTRUCTION_CPX = i; i += 1;
const INSTRUCTION_CPY = i; i += 1;
const INSTRUCTION_DEC = i; i += 1;
const INSTRUCTION_DEX = i; i += 1;
const INSTRUCTION_DEY = i; i += 1;
const INSTRUCTION_EOR = i; i += 1;
const INSTRUCTION_INC = i; i += 1;
const INSTRUCTION_INX = i; i += 1;
const INSTRUCTION_INY = i; i += 1;
const INSTRUCTION_JMP = i; i += 1;
const INSTRUCTION_JSR = i; i += 1;
const INSTRUCTION_LDA = i; i += 1;
const INSTRUCTION_LDX = i; i += 1;
const INSTRUCTION_LDY = i; i += 1;
const INSTRUCTION_LSR = i; i += 1;
const INSTRUCTION_NOP = i; i += 1;
const INSTRUCTION_ORA = i; i += 1;
const INSTRUCTION_PHA = i; i += 1;
const INSTRUCTION_PHP = i; i += 1;
const INSTRUCTION_PLA = i; i += 1;
const INSTRUCTION_PLP = i; i += 1;
const INSTRUCTION_ROL = i; i += 1;
const INSTRUCTION_ROR = i; i += 1;
const INSTRUCTION_RTI = i; i += 1;
const INSTRUCTION_RTS = i; i += 1;
const INSTRUCTION_SBC = i; i += 1;
const INSTRUCTION_SEC = i; i += 1;
const INSTRUCTION_SED = i; i += 1;
const INSTRUCTION_SEI = i; i += 1;
const INSTRUCTION_STA = i; i += 1;
const INSTRUCTION_STX = i; i += 1;
const INSTRUCTION_STY = i; i += 1;
const INSTRUCTION_TAX = i; i += 1;
const INSTRUCTION_TAY = i; i += 1;
const INSTRUCTION_TSX = i; i += 1;
const INSTRUCTION_TXA = i; i += 1;
const INSTRUCTION_TXS = i; i += 1;
const INSTRUCTION_TYA = i; i += 1;

// window.hist = new Uint32Array( 0xff );

function get_instruction( byte ) {
	var instruction = null;
	var mode = null;

    // window.hist[ byte ] += 1;

	switch( byte ) {
		case 0x00: instruction = INSTRUCTION_BRK; mode = MODE_IMP; break;
		case 0x01: instruction = INSTRUCTION_ORA; mode = MODE_IZX; break;
		case 0x05: instruction = INSTRUCTION_ORA; mode = MODE_ZPA; break;
		case 0x06: instruction = INSTRUCTION_ASL; mode = MODE_ZPA; break;
		case 0x08: instruction = INSTRUCTION_PHP; mode = MODE_IMP; break;
		case 0x09: instruction = INSTRUCTION_ORA; mode = MODE_IMM; break;
		case 0x0A: instruction = INSTRUCTION_ASL; mode = MODE_ACC; break;
		case 0x0D: instruction = INSTRUCTION_ORA; mode = MODE_ABS; break;
		case 0x0E: instruction = INSTRUCTION_ASL; mode = MODE_ABS; break;
		case 0x10: instruction = INSTRUCTION_BPL; mode = MODE_REL; break;
		case 0x11: instruction = INSTRUCTION_ORA; mode = MODE_IZY; break;
		case 0x15: instruction = INSTRUCTION_ORA; mode = MODE_ZPX; break;
		case 0x16: instruction = INSTRUCTION_ASL; mode = MODE_ZPX; break;
		case 0x18: instruction = INSTRUCTION_CLC; mode = MODE_IMP; break;
		case 0x19: instruction = INSTRUCTION_ORA; mode = MODE_ABY; break;
		case 0x1D: instruction = INSTRUCTION_ORA; mode = MODE_ABX; break;
		case 0x1E: instruction = INSTRUCTION_ASL; mode = MODE_ABX; break;
		case 0x20: instruction = INSTRUCTION_JSR; mode = MODE_ABS; break;
		case 0x21: instruction = INSTRUCTION_AND; mode = MODE_IZX; break;
		case 0x24: instruction = INSTRUCTION_BIT; mode = MODE_ZPA; break;
		case 0x25: instruction = INSTRUCTION_AND; mode = MODE_ZPA; break;
		case 0x26: instruction = INSTRUCTION_ROL; mode = MODE_ZPA; break;
		case 0x28: instruction = INSTRUCTION_PLP; mode = MODE_IMP; break;
		case 0x29: instruction = INSTRUCTION_AND; mode = MODE_IMM; break;
		case 0x2A: instruction = INSTRUCTION_ROL; mode = MODE_ACC; break;
		case 0x2C: instruction = INSTRUCTION_BIT; mode = MODE_ABS; break;
		case 0x2D: instruction = INSTRUCTION_AND; mode = MODE_ABS; break;
		case 0x2E: instruction = INSTRUCTION_ROL; mode = MODE_ABS; break;
		case 0x30: instruction = INSTRUCTION_BMI; mode = MODE_REL; break;
		case 0x31: instruction = INSTRUCTION_AND; mode = MODE_IZY; break;
		case 0x35: instruction = INSTRUCTION_AND; mode = MODE_ZPX; break;
		case 0x36: instruction = INSTRUCTION_ROL; mode = MODE_ZPX; break;
		case 0x38: instruction = INSTRUCTION_SEC; mode = MODE_IMP; break;
		case 0x39: instruction = INSTRUCTION_AND; mode = MODE_ABY; break;
		case 0x3D: instruction = INSTRUCTION_AND; mode = MODE_ABX; break;
		case 0x3E: instruction = INSTRUCTION_ROL; mode = MODE_ABX; break;
		case 0x40: instruction = INSTRUCTION_RTI; mode = MODE_IMP; break;
		case 0x41: instruction = INSTRUCTION_EOR; mode = MODE_IZX; break;
		case 0x45: instruction = INSTRUCTION_EOR; mode = MODE_ZPA; break;
		case 0x46: instruction = INSTRUCTION_LSR; mode = MODE_ZPA; break;
		case 0x48: instruction = INSTRUCTION_PHA; mode = MODE_IMP; break;
		case 0x49: instruction = INSTRUCTION_EOR; mode = MODE_IMM; break;
		case 0x4A: instruction = INSTRUCTION_LSR; mode = MODE_ACC; break;
		case 0x4C: instruction = INSTRUCTION_JMP; mode = MODE_ABS; break;
		case 0x4D: instruction = INSTRUCTION_EOR; mode = MODE_ABS; break;
		case 0x4E: instruction = INSTRUCTION_LSR; mode = MODE_ABS; break;
		case 0x50: instruction = INSTRUCTION_BVC; mode = MODE_REL; break;
		case 0x51: instruction = INSTRUCTION_EOR; mode = MODE_IZY; break;
		case 0x55: instruction = INSTRUCTION_EOR; mode = MODE_ZPX; break;
		case 0x56: instruction = INSTRUCTION_LSR; mode = MODE_ZPX; break;
		case 0x58: instruction = INSTRUCTION_CLI; mode = MODE_IMP; break;
		case 0x59: instruction = INSTRUCTION_EOR; mode = MODE_ABY; break;
		case 0x5D: instruction = INSTRUCTION_EOR; mode = MODE_ABX; break;
		case 0x5E: instruction = INSTRUCTION_LSR; mode = MODE_ABX; break;
		case 0x60: instruction = INSTRUCTION_RTS; mode = MODE_IMP; break;
		case 0x61: instruction = INSTRUCTION_ADC; mode = MODE_IZX; break;
		case 0x65: instruction = INSTRUCTION_ADC; mode = MODE_ZPA; break;
		case 0x66: instruction = INSTRUCTION_ROR; mode = MODE_ZPA; break;
		case 0x68: instruction = INSTRUCTION_PLA; mode = MODE_IMP; break;
		case 0x69: instruction = INSTRUCTION_ADC; mode = MODE_IMM; break;
		case 0x6A: instruction = INSTRUCTION_ROR; mode = MODE_ACC; break;
		case 0x6C: instruction = INSTRUCTION_JMP; mode = MODE_IND; break;
		case 0x6D: instruction = INSTRUCTION_ADC; mode = MODE_ABS; break;
		case 0x6E: instruction = INSTRUCTION_ROR; mode = MODE_ABS; break;
		case 0x70: instruction = INSTRUCTION_BVS; mode = MODE_REL; break;
		case 0x71: instruction = INSTRUCTION_ADC; mode = MODE_IZY; break;
		case 0x75: instruction = INSTRUCTION_ADC; mode = MODE_ZPX; break;
		case 0x76: instruction = INSTRUCTION_ROR; mode = MODE_ZPX; break;
		case 0x78: instruction = INSTRUCTION_SEI; mode = MODE_IMP; break;
		case 0x79: instruction = INSTRUCTION_ADC; mode = MODE_ABY; break;
		case 0x7D: instruction = INSTRUCTION_ADC; mode = MODE_ABX; break;
		case 0x7E: instruction = INSTRUCTION_ROR; mode = MODE_ABX; break;
		case 0x81: instruction = INSTRUCTION_STA; mode = MODE_IZX; break;
		case 0x84: instruction = INSTRUCTION_STY; mode = MODE_ZPA; break;
		case 0x85: instruction = INSTRUCTION_STA; mode = MODE_ZPA; break;
		case 0x86: instruction = INSTRUCTION_STX; mode = MODE_ZPA; break;
		case 0x88: instruction = INSTRUCTION_DEY; mode = MODE_IMP; break;
		case 0x8A: instruction = INSTRUCTION_TXA; mode = MODE_IMP; break;
		case 0x8C: instruction = INSTRUCTION_STY; mode = MODE_ABS; break;
		case 0x8D: instruction = INSTRUCTION_STA; mode = MODE_ABS; break;
		case 0x8E: instruction = INSTRUCTION_STX; mode = MODE_ABS; break;
		case 0x90: instruction = INSTRUCTION_BCC; mode = MODE_REL; break;
		case 0x91: instruction = INSTRUCTION_STA; mode = MODE_IZY; break;
		case 0x94: instruction = INSTRUCTION_STY; mode = MODE_ZPX; break;
		case 0x95: instruction = INSTRUCTION_STA; mode = MODE_ZPX; break;
		case 0x96: instruction = INSTRUCTION_STX; mode = MODE_ZPY; break;
		case 0x98: instruction = INSTRUCTION_TYA; mode = MODE_IMP; break;
		case 0x99: instruction = INSTRUCTION_STA; mode = MODE_ABY; break;
		case 0x9A: instruction = INSTRUCTION_TXS; mode = MODE_IMP; break;
		case 0x9D: instruction = INSTRUCTION_STA; mode = MODE_ABX; break;
		case 0xA0: instruction = INSTRUCTION_LDY; mode = MODE_IMM; break;
		case 0xA1: instruction = INSTRUCTION_LDA; mode = MODE_IZX; break;
		case 0xA2: instruction = INSTRUCTION_LDX; mode = MODE_IMM; break;
		case 0xA4: instruction = INSTRUCTION_LDY; mode = MODE_ZPA; break;
		case 0xA5: instruction = INSTRUCTION_LDA; mode = MODE_ZPA; break;
		case 0xA6: instruction = INSTRUCTION_LDX; mode = MODE_ZPA; break;
		case 0xA8: instruction = INSTRUCTION_TAY; mode = MODE_IMP; break;
		case 0xA9: instruction = INSTRUCTION_LDA; mode = MODE_IMM; break;
		case 0xAA: instruction = INSTRUCTION_TAX; mode = MODE_IMP; break;
		case 0xAC: instruction = INSTRUCTION_LDY; mode = MODE_ABS; break;
		case 0xAD: instruction = INSTRUCTION_LDA; mode = MODE_ABS; break;
		case 0xAE: instruction = INSTRUCTION_LDX; mode = MODE_ABS; break;
		case 0xB0: instruction = INSTRUCTION_BCS; mode = MODE_REL; break;
		case 0xB1: instruction = INSTRUCTION_LDA; mode = MODE_IZY; break;
		case 0xB4: instruction = INSTRUCTION_LDY; mode = MODE_ZPX; break;
		case 0xB5: instruction = INSTRUCTION_LDA; mode = MODE_ZPX; break;
		case 0xB6: instruction = INSTRUCTION_LDX; mode = MODE_ZPY; break;
		case 0xB8: instruction = INSTRUCTION_CLV; mode = MODE_IMP; break;
		case 0xB9: instruction = INSTRUCTION_LDA; mode = MODE_ABY; break;
		case 0xBA: instruction = INSTRUCTION_TSX; mode = MODE_IMP; break;
		case 0xBC: instruction = INSTRUCTION_LDY; mode = MODE_ABX; break;
		case 0xBD: instruction = INSTRUCTION_LDA; mode = MODE_ABX; break;
		case 0xBE: instruction = INSTRUCTION_LDX; mode = MODE_ABY; break;
		case 0xC0: instruction = INSTRUCTION_CPY; mode = MODE_IMM; break;
		case 0xC1: instruction = INSTRUCTION_CMP; mode = MODE_IZX; break;
		case 0xC4: instruction = INSTRUCTION_CPY; mode = MODE_ZPA; break;
		case 0xC5: instruction = INSTRUCTION_CMP; mode = MODE_ZPA; break;
		case 0xC6: instruction = INSTRUCTION_DEC; mode = MODE_ZPA; break;
		case 0xC8: instruction = INSTRUCTION_INY; mode = MODE_IMP; break;
		case 0xC9: instruction = INSTRUCTION_CMP; mode = MODE_IMM; break;
		case 0xCA: instruction = INSTRUCTION_DEX; mode = MODE_IMP; break;
		case 0xCC: instruction = INSTRUCTION_CPY; mode = MODE_ABS; break;
		case 0xCD: instruction = INSTRUCTION_CMP; mode = MODE_ABS; break;
		case 0xCE: instruction = INSTRUCTION_DEC; mode = MODE_ABS; break;
		case 0xD0: instruction = INSTRUCTION_BNE; mode = MODE_REL; break;
		case 0xD1: instruction = INSTRUCTION_CMP; mode = MODE_IZY; break;
		case 0xD5: instruction = INSTRUCTION_CMP; mode = MODE_ZPX; break;
		case 0xD6: instruction = INSTRUCTION_DEC; mode = MODE_ZPX; break;
		case 0xD8: instruction = INSTRUCTION_CLD; mode = MODE_IMP; break;
		case 0xD9: instruction = INSTRUCTION_CMP; mode = MODE_ABY; break;
		case 0xDD: instruction = INSTRUCTION_CMP; mode = MODE_ABX; break;
		case 0xDE: instruction = INSTRUCTION_DEC; mode = MODE_ABX; break;
		case 0xE0: instruction = INSTRUCTION_CPX; mode = MODE_IMM; break;
		case 0xE1: instruction = INSTRUCTION_SBC; mode = MODE_IZX; break;
		case 0xE4: instruction = INSTRUCTION_CPX; mode = MODE_ZPA; break;
		case 0xE5: instruction = INSTRUCTION_SBC; mode = MODE_ZPA; break;
		case 0xE6: instruction = INSTRUCTION_INC; mode = MODE_ZPA; break;
		case 0xE8: instruction = INSTRUCTION_INX; mode = MODE_IMP; break;
		case 0xE9: instruction = INSTRUCTION_SBC; mode = MODE_IMM; break;
		case 0xEA: instruction = INSTRUCTION_NOP; mode = MODE_IMP; break;
		case 0xEC: instruction = INSTRUCTION_CPX; mode = MODE_ABS; break;
		case 0xED: instruction = INSTRUCTION_SBC; mode = MODE_ABS; break;
		case 0xEE: instruction = INSTRUCTION_INC; mode = MODE_ABS; break;
		case 0xF0: instruction = INSTRUCTION_BEQ; mode = MODE_REL; break;
		case 0xF1: instruction = INSTRUCTION_SBC; mode = MODE_IZY; break;
		case 0xF5: instruction = INSTRUCTION_SBC; mode = MODE_ZPX; break;
		case 0xF6: instruction = INSTRUCTION_INC; mode = MODE_ZPX; break;
		case 0xF8: instruction = INSTRUCTION_SED; mode = MODE_IMP; break;
		case 0xF9: instruction = INSTRUCTION_SBC; mode = MODE_ABY; break;
		case 0xFD: instruction = INSTRUCTION_SBC; mode = MODE_ABX; break;
		case 0xFE: instruction = INSTRUCTION_INC; mode = MODE_ABX; break;

		// unofficial

		// case 0x03:
		// 	instruction = "SLO";
		// 	mode = MODE_IZX;
		// 	break;

		case 0x04:
		case 0x14:
		case 0x34:
		case 0x44:
		case 0x54:
		case 0x64:
		case 0x74:
		case 0xD4:
		case 0xF4:
		case 0x80:
			instruction = "2NOP"; mode = MODE_IMP; break;


		case 0x0C:
		case 0x1C:
		case 0x3C:
		case 0x5C:
		case 0x7C:
		case 0xDC:
		case 0xFC:
			instruction = "3NOP"; mode = MODE_IMP; break;

		// default:
			// instruction = "NOP"; mode = MODE_IMP; break;

		default:
			throw "illegal opcode: " + hex( byte, 2 ) + " at address " + hex( app.nes.cpu.pc, 4 );
	}

	return [ instruction, mode ];
}

export function cpu() {
    this.log = "";

    this.cycles = 7;

    this.interrupt_pending = 0;

    this.start = function() {
        this.pc = 0x00; // program counter
        this.s  = 0xfd; // stack pointer
        this.a  = 0x00; // accumulator
        this.x  = 0x00; // index register x
        this.y  = 0x00; // index register y

        // processor status (flags)
        // this.p  = 0x34;
        this.p_c = 0; // carry
        this.p_z = 0; // zero
        this.p_i = 0; // interrupt disable
        this.p_d = 0; // decimal mode (unused)
        this.p_b = 0; // break command (only exists on stack)
        this.p_v = 1; // overflow
        this.p_n = 1; // negative
    };

    this.start();

    this.instruction = 0;

    this.step = function() {
        var pc_previous = this.pc;

        var self = this;

        function get_2( i ) {
            var lo = app.nes.bus_read( i );
            var hi = app.nes.bus_read( i + 1 ) << 8;
            return lo | hi;
        }

        function update_nz() {
            self.p_z = value == 0 ? 1 : 0;
            self.p_n = ( value >> 7 ) & 1;
        }

        function stack_pull() {
            self.s = ( self.s + 1 ) & 0xff;
            var temp = app.nes.bus_read( 0x0100 + self.s );

            return temp;
        }

        function stack_push( value ) {
            app.nes.bus_write( 0x0100 + self.s, value );
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

        if ( this.interrupt_pending != 0 ) {
            switch( this.interrupt_pending ) {
                case INTERRUPT_NMI:
                    push_pc();
                    push_flags();
                    this.pc = get_2( 0xfffa );
                    break;
                case INTERRUPT_RESET:
                    push_pc();
                    push_flags();
                    this.pc = get_2( 0xfffc );
                    break;
                case INTERRUPT_IRQ:
                    push_pc();
                    push_flags();
                    this.pc = get_2( 0xfffe );
                    break;
            }

            this.interrupt_pending = 0;

            return;
        }

        var instruction;
        var mode;
        var value, address, cost, size;
        var paged = 0; // TODO

        var byte = app.nes.bus_read( this.pc );
        [ instruction, mode ] = get_instruction( byte );
        this.instruction = instruction;

        var temp, temp_2, temp_3;

        switch ( mode ) {
            case MODE_ACC :
                value = this.a;
                break;
            case MODE_IMM :
                value = app.nes.bus_read( this.pc + 1 );
                break;
            case MODE_ZPA :
                address = app.nes.bus_read( this.pc + 1 );
                break;
            case MODE_ZPX :
                address = app.nes.bus_read( this.pc + 1 );
                // temp = address;
                address = ( address + this.x ) & 0x00ff;
                break;
            case MODE_ZPY :
                address = app.nes.bus_read( this.pc + 1 );
                // temp = address;
                address = ( address + this.y ) & 0x00ff;
                break;
            case MODE_REL :
                var d = app.nes.bus_read( this.pc + 1 );
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
                address = get_2( this.pc + 1 );
                break;
            case MODE_ABX :
                temp = get_2( this.pc + 1 );
                address = ( temp + this.x ) & 0xffff;
                if ( ( temp & 0xFF00 ) != ( address & 0xFF00 ) ) { paged = 1; }
                break;
            case MODE_ABY :
                temp = address = get_2( this.pc + 1 );
                address = ( temp + this.y ) & 0xffff;
                if ( ( temp & 0xFF00 ) != ( address & 0xFF00 ) ) { paged = 1; }
                break;
            case MODE_IND :
                temp = address = get_2( this.pc + 1 );

                function get_2_temp( i, mask = 0xffff ) {
                    var page = i & 0xFF00;
                    var j = i + 1;
                    if ( j == page + 0x0100 ) { j = page; }
                    var lo = app.nes.bus_read( j & mask ) << 8;
                    var hi = app.nes.bus_read( i & mask );
                    return lo | hi;
                }

                address = get_2_temp( temp );
                break;
            case MODE_IZX :
                temp = app.nes.bus_read( this.pc + 1 );
                temp_2  = ( temp + this.x ) & 0x00ff;

                address = get_2_temp( temp_2, 0x00ff );
                break;
            case MODE_IZY :
                temp = app.nes.bus_read( this.pc + 1 );
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
            case INSTRUCTION_LDA : if ( value == undefined ) { value = app.nes.bus_read( address ); } this.a = value; update_nz(); cost_0(); break;
            case INSTRUCTION_LDX : if ( value == undefined ) { value = app.nes.bus_read( address ); } this.x = value; update_nz(); cost_0(); break;
            case INSTRUCTION_LDY : if ( value == undefined ) { value = app.nes.bus_read( address ); } this.y = value; update_nz(); cost_0(); break;

            case INSTRUCTION_STA : app.nes.bus_write( address, this.a ); cost_1(); break;
            case INSTRUCTION_STX : app.nes.bus_write( address, this.x ); cost_1(); break;
            case INSTRUCTION_STY : app.nes.bus_write( address, this.y ); cost_1(); break;

            case INSTRUCTION_TAX : value = this.a; this.x = value; update_nz(); size = 1; cost = 2; break;
            case INSTRUCTION_TAY : value = this.a; this.y = value; update_nz(); size = 1; cost = 2; break;
            case INSTRUCTION_TXA : value = this.x; this.a = value; update_nz(); size = 1; cost = 2; break;
            case INSTRUCTION_TYA : value = this.y; this.a = value; update_nz(); size = 1; cost = 2; break;

            case INSTRUCTION_TSX : value = this.s      ; this.x = value; update_nz(); size = 1; cost = 2; break;
            case INSTRUCTION_TXS : value = this.x      ; this.s = value;              size = 1; cost = 2; break;
            case INSTRUCTION_PLA : value = stack_pull(); this.a = value; update_nz(); size = 1; cost = 4; break;
            case INSTRUCTION_PHA : stack_push( this.a ); value = this.a;              size = 1; cost = 3; break;
            case INSTRUCTION_PLP : pull_flags();                                      size = 1; cost = 4; break;
            case INSTRUCTION_PHP : push_flags( 1 );                                   size = 1; cost = 3; break;

            case INSTRUCTION_AND : if ( value == undefined ) { value = app.nes.bus_read( address ); } value = this.a & value; this.a = value; update_nz(); cost_0(); break;
            case INSTRUCTION_EOR : if ( value == undefined ) { value = app.nes.bus_read( address ); } value = this.a ^ value; this.a = value; update_nz(); cost_0(); break;
            case INSTRUCTION_ORA : if ( value == undefined ) { value = app.nes.bus_read( address ); } value = this.a | value; this.a = value; update_nz(); cost_0(); break;

            case INSTRUCTION_BIT :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                temp = value;
                value = this.a & value;
                update_nz();
                this.p_v = ( temp >> 6 ) & 1;
                this.p_n = ( temp >> 7 ) & 1;
                cost_0();
                break;

            case INSTRUCTION_SBC :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                value = ( ~ value ) & 0xff;
            case INSTRUCTION_ADC :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                temp = value;
                value = this.a + value + this.p_c;
                this.p_c = value > 0xff ? 1 : 0;
                value = value & 0xff;
                this.p_v = ( this.a & 0x80 ) == ( temp & 0x80 ) && ( this.a & 0x80 ) != ( value & 0x80 ) ? 1 : 0;
                this.a = value;
                update_nz();
                cost_0();
                break;

            case INSTRUCTION_CMP :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                value = this.a - value;
                this.p_c = value >= 0 ? 1 : 0;
                update_nz();
                cost_0();
                break;

            case INSTRUCTION_CPX :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                value = this.x - value;
                this.p_c = value >= 0 ? 1 : 0;
                update_nz();
                cost_0();
                break;

            case INSTRUCTION_CPY :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                value = this.y - value;
                this.p_c = value >= 0 ? 1 : 0;
                update_nz();
                cost_0();
                break;

            case INSTRUCTION_INC :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                value = ( value + 1 ) & 0xff;
                app.nes.bus_write( address, value );
                update_nz();
                cost_2();
                break;

            case INSTRUCTION_INX :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                value = ( this.x + 1 ) & 0xff;
                this.x = value;
                update_nz();
                size = 1;
                cost = 2;
                break;

            case INSTRUCTION_INY :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                value = ( this.y + 1 ) & 0xff;
                this.y = value;
                update_nz();
                size = 1;
                cost = 2;
                break;

            case INSTRUCTION_DEC :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                value = value - 1;
                app.nes.bus_write( address, value );
                update_nz();
                cost_2();
                break;

            case INSTRUCTION_DEX :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                value = ( this.x - 1 ) & 0xff;
                this.x = value;
                update_nz();
                size = 1;
                cost = 2;
                break;

            case INSTRUCTION_DEY :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                value = ( this.y - 1 ) & 0xff;
                this.y = value;
                update_nz();
                size = 1;
                cost = 2;
                break;

            case INSTRUCTION_ASL :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                this.p_c = ( value & 0b10000000 ) >> 7;
                value = ( value << 1 ) & 0xff;

                if ( mode == MODE_ACC ) {
                    this.a = value;
                } else {
                    app.nes.bus_write( address, value );
                }

                update_nz();
                cost_2();
                break;

            case INSTRUCTION_LSR :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                this.p_c = ( value & 0b00000001 );
                value = ( value >> 1 );

                if ( mode == MODE_ACC ) {
                    this.a = value;
                } else {
                    app.nes.bus_write( address, value );
                }

                update_nz();
                cost_2();
                break;

            case INSTRUCTION_ROL :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                temp = this.p_c;
                this.p_c = ( value & 0b10000000 ) >> 7;
                value = ( value << 1 ) | temp;
                value = value & 0xff;

                if ( mode == MODE_ACC ) {
                    this.a = value;
                } else {
                    app.nes.bus_write( address, value );
                }

                update_nz();
                cost_2();
                break;

            case INSTRUCTION_ROR :
                if ( value == undefined ) { value = app.nes.bus_read( address ); }
                temp = this.p_c;
                this.p_c = ( value & 0b00000001 );
                value = ( value >> 1 ) | ( temp << 7 );

                if ( mode == MODE_ACC ) {
                    this.a = value;
                } else {
                    app.nes.bus_write( address, value );
                }

                update_nz();
                cost_2();
                break;

            case INSTRUCTION_JMP :
                this.pc = address - 3;
                size = 3;
                cost_5();
                break;

            case INSTRUCTION_JSR :
                size = 3;

                push_pc( size )

                this.pc = address - 3;

                cost = 6;
                break;

            case INSTRUCTION_RTS :
                size = 1;
                this.pc = ( ( stack_pull() ) | stack_pull() << 8 ) + 1 - size;
                cost = 6;

                break;

            case INSTRUCTION_BCC : branch( this.p_c == 0 ); break;
            case INSTRUCTION_BCS : branch( this.p_c == 1 ); break;
            case INSTRUCTION_BEQ : branch( this.p_z == 1 ); break;
            case INSTRUCTION_BMI : branch( this.p_n == 1 ); break;
            case INSTRUCTION_BNE : branch( this.p_z == 0 ); break;
            case INSTRUCTION_BPL : branch( this.p_n == 0 ); break;
            case INSTRUCTION_BVC : branch( this.p_v == 0 ); break;
            case INSTRUCTION_BVS : branch( this.p_v == 1 ); break;

            case INSTRUCTION_CLC : this.p_c = 0; size = 1; cost = 2; break;
            case INSTRUCTION_CLD : this.p_d = 0; size = 1; cost = 2; break;
            case INSTRUCTION_CLI  :this.p_i = 0; size = 1; cost = 2; break;
            case INSTRUCTION_CLV : this.p_v = 0; size = 1; cost = 2; break;
            case INSTRUCTION_SEC : this.p_c = 1; size = 1; cost = 2; break;
            case INSTRUCTION_SED : this.p_d = 1; size = 1; cost = 2; break;
            case INSTRUCTION_SEI : this.p_i = 1; size = 1; cost = 2; break;

            // TODO verify;
            // TODO maybe combine with irq_pending value
            case INSTRUCTION_BRK :
                this.interrupt_pending = INTERRUPT_IRQ;
                this.p_b = 1;
                size = 1;
                cost = 7;
                break;

            case INSTRUCTION_NOP : size = 1; cost = 2; break;

            case INSTRUCTION_RTI :
                pull_flags();
                size = 1;
                pull_pc( size );
                cost = 6;
                break;
        }


        // var [ ppu_x, ppu_y ] = app.nes.ppu.get_xy();

        // this.log = this.log + hex(pc_previous, 4 ) + " ";
        // this.log = this.log + text_for_instruction( instruction ) + " ";
        // this.log = this.log + "PPU:" + ( ppu_x + "" ).padStart( 3, " ") + "," + ( ppu_y + "" ).padStart( 3, " " ) + " ";
        // this.log = this.log + "CYC:" + this.cycles + "\n";

        this.pc = this.pc + size;
        this.cycles += cost;
    }
}

window.text_for_instruction = function( instruction ) {
    switch( instruction ) {
        case INSTRUCTION_ADC : return "ADC";
        case INSTRUCTION_AND : return "AND";
        case INSTRUCTION_ASL : return "ASL";
        case INSTRUCTION_BCC : return "BCC";
        case INSTRUCTION_BCS : return "BCS";
        case INSTRUCTION_BEQ : return "BEQ";
        case INSTRUCTION_BIT : return "BIT";
        case INSTRUCTION_BMI : return "BMI";
        case INSTRUCTION_BNE : return "BNE";
        case INSTRUCTION_BPL : return "BPL";
        case INSTRUCTION_BRK : return "BRK";
        case INSTRUCTION_BVC : return "BVC";
        case INSTRUCTION_BVS : return "BVS";
        case INSTRUCTION_CLC : return "CLC";
        case INSTRUCTION_CLD : return "CLD";
        case INSTRUCTION_CLI : return "CLI";
        case INSTRUCTION_CLV : return "CLV";
        case INSTRUCTION_CMP : return "CMP";
        case INSTRUCTION_CPX : return "CPX";
        case INSTRUCTION_CPY : return "CPY";
        case INSTRUCTION_DEC : return "DEC";
        case INSTRUCTION_DEX : return "DEX";
        case INSTRUCTION_DEY : return "DEY";
        case INSTRUCTION_EOR : return "EOR";
        case INSTRUCTION_INC : return "INC";
        case INSTRUCTION_INX : return "INX";
        case INSTRUCTION_INY : return "INY";
        case INSTRUCTION_JMP : return "JMP";
        case INSTRUCTION_JSR : return "JSR";
        case INSTRUCTION_LDA : return "LDA";
        case INSTRUCTION_LDX : return "LDX";
        case INSTRUCTION_LDY : return "LDY";
        case INSTRUCTION_LSR : return "LSR";
        case INSTRUCTION_NOP : return "NOP";
        case INSTRUCTION_ORA : return "ORA";
        case INSTRUCTION_PHA : return "PHA";
        case INSTRUCTION_PHP : return "PHP";
        case INSTRUCTION_PLA : return "PLA";
        case INSTRUCTION_PLP : return "PLP";
        case INSTRUCTION_ROL : return "ROL";
        case INSTRUCTION_ROR : return "ROR";
        case INSTRUCTION_RTI : return "RTI";
        case INSTRUCTION_RTS : return "RTS";
        case INSTRUCTION_SBC : return "SBC";
        case INSTRUCTION_SEC : return "SEC";
        case INSTRUCTION_SED : return "SED";
        case INSTRUCTION_SEI : return "SEI";
        case INSTRUCTION_STA : return "STA";
        case INSTRUCTION_STX : return "STX";
        case INSTRUCTION_STY : return "STY";
        case INSTRUCTION_TAX : return "TAX";
        case INSTRUCTION_TAY : return "TAY";
        case INSTRUCTION_TSX : return "TSX";
        case INSTRUCTION_TXA : return "TXA";
        case INSTRUCTION_TXS : return "TXS";
        case INSTRUCTION_TYA : return "TYA";
    }
}
