"use strict";

var audio_enabled = true;

export function audio() {
    if ( audio_enabled == false ) {
        this.update_fixed = function() {};
        return;
    }

    this.context = new ( window.AudioContext || window.webkitAudioContext );

    // var pass_node = this.context.createBiquadFilter();
    //     pass_node.type = "highpass"
    //     pass_node.frequency.value = 440;
    //     pass_node.connect( this.context.destination );

    // var pass_node_1 = this.context.createBiquadFilter();
    //     pass_node_1.type = "lowpass"
    //     pass_node_1.frequency.value = 14000;
    //     pass_node_1.connect( pass_node_0 );

    var gain_node_master = this.context.createGain();
        gain_node_master.gain.value = 0.2;
        gain_node_master.connect( this.context.destination );
        // gain_node_master.connect( pass_node_1 );

    this.waves = [];

    var self = this;

    function create_wave( duty ) {
        const count = 64;

        function f ( duty, i ) {
            return Math.sin( duty * i * Math.PI ) / ( i * Math.PI );
        }
        
        var real = new Float32Array( count + 1 );
        var imag = new Float32Array( count + 1 );

        for ( var i = 0; i < count; i += 1 ) {
            real[ i + 1 ] = f( duty, i + 1 );
        }

        return self.context.createPeriodicWave( real, imag );
    }

    for ( var i = 0; i < 4; i += 1 ) {
        this.waves[i] = create_wave( [ 0.125, 0.25, 0.5, 0.75 ][i] );
    }

    this.gain_nodes = [];
    this.wave_nodes = [];

    for ( var i = 0; i < 3; i += 1 ) {
        this.gain_nodes[ i ]= this.context.createGain();
        this.gain_nodes[ i ].connect( gain_node_master );
        this.gain_nodes[ i ].gain.value = 0.0;

        this.wave_nodes[ i ] = this.context.createOscillator();
        this.wave_nodes[ i ].connect( this.gain_nodes[ i ] );

        switch ( i ) {
            case 0:
            case 1:
                // wave_nodes[ i ].type = "square";
                this.wave_nodes[ i ].setPeriodicWave( this.waves[ 0 ] );
                break;
            case 2:
                this.wave_nodes[ i ].type = "triangle";
                break;
            case 3:
                // TODO
                break;
        }

        this.wave_nodes[ i ].start();
    }

    // var node = context.createScriptProcessor( 256, 0, 1 );
    //     node.onaudioprocess = function( event ) {
    //         var output_buffer = event.outputBuffer;

    //         for ( var i = 0; i < output_buffer.length; i += 1 ) {
    //             output_buffer.getChannelData( 0 )[ i ] = Math.random() * 2 - 1;
    //         }

    //         update_apu();
    //     };
    //     node.connect( gain );
    
    this.update_fixed = function() {
        app.nes.apu.update_fixed();
    };
}