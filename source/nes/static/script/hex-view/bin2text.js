//https://en.wikipedia.org/wiki/Base32

var format = {};

var abc_0_9 = "0123456789";
var abc_A_Z = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var abc_a_z = "abcdefghijklmnopqrstuvwxyz";

format.yEnc = function( buffer ) {
    var abc = abc_0_9 +
              abc_A_Z +
              abc_a_z +
              "!#$%&()*+-;<=>?@^_`{|}~";

    while ( buffer.length > 128 ) {

    }
    
}

format.base85 = function() {

}

format.base64 = function() {

};

format.base58 = function() {

}

format.base36 = function() {

}

format.base32 = function() {

}