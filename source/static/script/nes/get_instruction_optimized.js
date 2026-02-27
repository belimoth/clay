"use strict";

function get_instruction( byte ) {
    switch( byte ) {
        case 0x66: return [ INSTRUCTION_ROR, MODE_ZPA ];
        case 0xA5: return [ INSTRUCTION_LDA, MODE_ZPA ];
        case 0x29: return [ INSTRUCTION_AND, MODE_IMM ];
        case 0x85: return [ INSTRUCTION_STA, MODE_ZPA ];
		case 0x20: return [ INSTRUCTION_JSR, MODE_ABS ];
        case 0x60: return [ INSTRUCTION_RTS, MODE_IMP ];
        case 0xF0: return [ INSTRUCTION_BEQ, MODE_REL ];
		case 0x18: return [ INSTRUCTION_CLC, MODE_IMP ];
		case 0x4C: return [ INSTRUCTION_JMP, MODE_ABS ];
        case 0x45: return [ INSTRUCTION_EOR, MODE_ZPA ];
		case 0x38: return [ INSTRUCTION_SEC, MODE_IMP ];
        case 0xD0: return [ INSTRUCTION_BNE, MODE_REL ];
		case 0xC8: return [ INSTRUCTION_INY, MODE_IMP ];
		case 0xC9: return [ INSTRUCTION_CMP, MODE_IMM ];
		case 0xBD: return [ INSTRUCTION_LDA, MODE_ABX ];
		case 0xA9: return [ INSTRUCTION_LDA, MODE_IMM ];
		case 0x68: return [ INSTRUCTION_PLA, MODE_IMP ];
        case 0x48: return [ INSTRUCTION_PHA, MODE_IMP ];
		case 0x0A: return [ INSTRUCTION_ASL, MODE_ACC ];
        case 0xB1: return [ INSTRUCTION_LDA, MODE_IZY ];
        case 0x65: return [ INSTRUCTION_ADC, MODE_ZPA ];
        case 0xAA: return [ INSTRUCTION_TAX, MODE_IMP ];
		case 0x4A: return [ INSTRUCTION_LSR, MODE_ACC ];
		case 0x69: return [ INSTRUCTION_ADC, MODE_IMM ];
		case 0xCA: return [ INSTRUCTION_DEX, MODE_IMP ];
		case 0xC5: return [ INSTRUCTION_CMP, MODE_ZPA ];
		case 0x91: return [ INSTRUCTION_STA, MODE_IZY ];
        case 0x90: return [ INSTRUCTION_BCC, MODE_REL ];
		case 0xA6: return [ INSTRUCTION_LDX, MODE_ZPA ];
		case 0xB5: return [ INSTRUCTION_LDA, MODE_ZPX ];
		case 0xA0: return [ INSTRUCTION_LDY, MODE_IMM ];
		case 0xE5: return [ INSTRUCTION_SBC, MODE_ZPA ];
        case 0x88: return [ INSTRUCTION_DEY, MODE_IMP ];
        case 0x98: return [ INSTRUCTION_TYA, MODE_IMP ];
		case 0x8D: return [ INSTRUCTION_STA, MODE_ABS ];
		case 0x10: return [ INSTRUCTION_BPL, MODE_REL ];
		case 0xA8: return [ INSTRUCTION_TAY, MODE_IMP ];
		case 0xB0: return [ INSTRUCTION_BCS, MODE_REL ];
		case 0xAD: return [ INSTRUCTION_LDA, MODE_ABS ];

		case 0x00: return [ INSTRUCTION_BRK, MODE_IMP ];
		case 0x01: return [ INSTRUCTION_ORA, MODE_IZX ];
		case 0x05: return [ INSTRUCTION_ORA, MODE_ZPA ];
		case 0x06: return [ INSTRUCTION_ASL, MODE_ZPA ];
		case 0x08: return [ INSTRUCTION_PHP, MODE_IMP ];
		case 0x09: return [ INSTRUCTION_ORA, MODE_IMM ];
		case 0x0D: return [ INSTRUCTION_ORA, MODE_ABS ];
        case 0x0E: return [ INSTRUCTION_ASL, MODE_ABS ];

		case 0x11: return [ INSTRUCTION_ORA, MODE_IZY ];
		case 0x15: return [ INSTRUCTION_ORA, MODE_ZPX ];
		case 0x16: return [ INSTRUCTION_ASL, MODE_ZPX ];
		case 0x19: return [ INSTRUCTION_ORA, MODE_ABY ];
		case 0x1D: return [ INSTRUCTION_ORA, MODE_ABX ];
        case 0x1E: return [ INSTRUCTION_ASL, MODE_ABX ];

		case 0x21: return [ INSTRUCTION_AND, MODE_IZX ];
		case 0x24: return [ INSTRUCTION_BIT, MODE_ZPA ];
		case 0x25: return [ INSTRUCTION_AND, MODE_ZPA ];
		case 0x26: return [ INSTRUCTION_ROL, MODE_ZPA ];
		case 0x28: return [ INSTRUCTION_PLP, MODE_IMP ];
		case 0x2A: return [ INSTRUCTION_ROL, MODE_ACC ];
		case 0x2C: return [ INSTRUCTION_BIT, MODE_ABS ];
		case 0x2D: return [ INSTRUCTION_AND, MODE_ABS ];
        case 0x2E: return [ INSTRUCTION_ROL, MODE_ABS ];

		case 0x30: return [ INSTRUCTION_BMI, MODE_REL ];
		case 0x31: return [ INSTRUCTION_AND, MODE_IZY ];
		case 0x35: return [ INSTRUCTION_AND, MODE_ZPX ];
		case 0x36: return [ INSTRUCTION_ROL, MODE_ZPX ];
		case 0x39: return [ INSTRUCTION_AND, MODE_ABY ];
		case 0x3D: return [ INSTRUCTION_AND, MODE_ABX ];
        case 0x3E: return [ INSTRUCTION_ROL, MODE_ABX ];

		case 0x40: return [ INSTRUCTION_RTI, MODE_IMP ];
		case 0x41: return [ INSTRUCTION_EOR, MODE_IZX ];
		case 0x46: return [ INSTRUCTION_LSR, MODE_ZPA ];
		case 0x49: return [ INSTRUCTION_EOR, MODE_IMM ];
		case 0x4D: return [ INSTRUCTION_EOR, MODE_ABS ];
        case 0x4E: return [ INSTRUCTION_LSR, MODE_ABS ];

		case 0x50: return [ INSTRUCTION_BVC, MODE_REL ];
		case 0x51: return [ INSTRUCTION_EOR, MODE_IZY ];
		case 0x55: return [ INSTRUCTION_EOR, MODE_ZPX ];
		case 0x56: return [ INSTRUCTION_LSR, MODE_ZPX ];
		case 0x58: return [ INSTRUCTION_CLI, MODE_IMP ];
		case 0x59: return [ INSTRUCTION_EOR, MODE_ABY ];
		case 0x5D: return [ INSTRUCTION_EOR, MODE_ABX ];
        case 0x5E: return [ INSTRUCTION_LSR, MODE_ABX ];

		case 0x61: return [ INSTRUCTION_ADC, MODE_IZX ];
		case 0x6A: return [ INSTRUCTION_ROR, MODE_ACC ];
		case 0x6C: return [ INSTRUCTION_JMP, MODE_IND ];
		case 0x6D: return [ INSTRUCTION_ADC, MODE_ABS ];
        case 0x6E: return [ INSTRUCTION_ROR, MODE_ABS ];

		case 0x70: return [ INSTRUCTION_BVS, MODE_REL ];
		case 0x71: return [ INSTRUCTION_ADC, MODE_IZY ];
		case 0x75: return [ INSTRUCTION_ADC, MODE_ZPX ];
		case 0x76: return [ INSTRUCTION_ROR, MODE_ZPX ];
		case 0x78: return [ INSTRUCTION_SEI, MODE_IMP ];
		case 0x79: return [ INSTRUCTION_ADC, MODE_ABY ];
		case 0x7D: return [ INSTRUCTION_ADC, MODE_ABX ];
        case 0x7E: return [ INSTRUCTION_ROR, MODE_ABX ];

		case 0x81: return [ INSTRUCTION_STA, MODE_IZX ];
		case 0x84: return [ INSTRUCTION_STY, MODE_ZPA ];
		case 0x86: return [ INSTRUCTION_STX, MODE_ZPA ];
		case 0x8A: return [ INSTRUCTION_TXA, MODE_IMP ];
		case 0x8C: return [ INSTRUCTION_STY, MODE_ABS ];
        case 0x8E: return [ INSTRUCTION_STX, MODE_ABS ];

		case 0x94: return [ INSTRUCTION_STY, MODE_ZPX ];
		case 0x95: return [ INSTRUCTION_STA, MODE_ZPX ];
		case 0x96: return [ INSTRUCTION_STX, MODE_ZPY ];
		case 0x99: return [ INSTRUCTION_STA, MODE_ABY ];
		case 0x9A: return [ INSTRUCTION_TXS, MODE_IMP ];
        case 0x9D: return [ INSTRUCTION_STA, MODE_ABX ];

		case 0xA1: return [ INSTRUCTION_LDA, MODE_IZX ];
		case 0xA2: return [ INSTRUCTION_LDX, MODE_IMM ];
		case 0xA4: return [ INSTRUCTION_LDY, MODE_ZPA ];
		case 0xAC: return [ INSTRUCTION_LDY, MODE_ABS ];
        case 0xAE: return [ INSTRUCTION_LDX, MODE_ABS ];

		case 0xB4: return [ INSTRUCTION_LDY, MODE_ZPX ];
		case 0xB6: return [ INSTRUCTION_LDX, MODE_ZPY ];
		case 0xB8: return [ INSTRUCTION_CLV, MODE_IMP ];
		case 0xB9: return [ INSTRUCTION_LDA, MODE_ABY ];
		case 0xBA: return [ INSTRUCTION_TSX, MODE_IMP ];
		case 0xBC: return [ INSTRUCTION_LDY, MODE_ABX ];
        case 0xBE: return [ INSTRUCTION_LDX, MODE_ABY ];

		case 0xC0: return [ INSTRUCTION_CPY, MODE_IMM ];
		case 0xC1: return [ INSTRUCTION_CMP, MODE_IZX ];
		case 0xC4: return [ INSTRUCTION_CPY, MODE_ZPA ];
		case 0xC6: return [ INSTRUCTION_DEC, MODE_ZPA ];
		case 0xCC: return [ INSTRUCTION_CPY, MODE_ABS ];
		case 0xCD: return [ INSTRUCTION_CMP, MODE_ABS ];
        case 0xCE: return [ INSTRUCTION_DEC, MODE_ABS ];

		case 0xD1: return [ INSTRUCTION_CMP, MODE_IZY ];
		case 0xD5: return [ INSTRUCTION_CMP, MODE_ZPX ];
		case 0xD6: return [ INSTRUCTION_DEC, MODE_ZPX ];
		case 0xD8: return [ INSTRUCTION_CLD, MODE_IMP ];
		case 0xD9: return [ INSTRUCTION_CMP, MODE_ABY ];
		case 0xDD: return [ INSTRUCTION_CMP, MODE_ABX ];
        case 0xDE: return [ INSTRUCTION_DEC, MODE_ABX ];

		case 0xE0: return [ INSTRUCTION_CPX, MODE_IMM ];
		case 0xE1: return [ INSTRUCTION_SBC, MODE_IZX ];
		case 0xE4: return [ INSTRUCTION_CPX, MODE_ZPA ];
		case 0xE6: return [ INSTRUCTION_INC, MODE_ZPA ];
		case 0xE8: return [ INSTRUCTION_INX, MODE_IMP ];
		case 0xE9: return [ INSTRUCTION_SBC, MODE_IMM ];
		case 0xEA: return [ INSTRUCTION_NOP, MODE_IMP ];
		case 0xEC: return [ INSTRUCTION_CPX, MODE_ABS ];
		case 0xED: return [ INSTRUCTION_SBC, MODE_ABS ];
        case 0xEE: return [ INSTRUCTION_INC, MODE_ABS ];

		case 0xF1: return [ INSTRUCTION_SBC, MODE_IZY ];
		case 0xF5: return [ INSTRUCTION_SBC, MODE_ZPX ];
		case 0xF6: return [ INSTRUCTION_INC, MODE_ZPX ];
		case 0xF8: return [ INSTRUCTION_SED, MODE_IMP ];
		case 0xF9: return [ INSTRUCTION_SBC, MODE_ABY ];
		case 0xFD: return [ INSTRUCTION_SBC, MODE_ABX ];
		case 0xFE: return [ INSTRUCTION_INC, MODE_ABX ];

		default:
			throw "illegal opcode: " + hex( byte, 2 ) + " at address " + hex( app.nes.cpu.pc, 4 );
	}

	return [ instruction, mode ];
}
