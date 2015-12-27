/**
 * Created by paulo.simao on 23/12/2015.
 */

//var parser = require('../index').createparser();
//var Buffer = require('buffer');
describe('Parsing  Test', function () {
    it('Parsing Test', function (done) {
        //parser.on('msg', function (msg) {
        //    console.log(msg);
        //});
        //parser.addchunck('CONNECT\na:1\nb:2\n\nteste123\0');

        //var b = new Buffer([0x00,0x61]);
        var b = new Buffer('ABCÇ\0','utf-8');
        console.log(b);
        for (var i = 0; i < b.length; i ++) {
            var b1 = b.readUInt8(i);
            console.log(i + ':' + b1 + ':' + String.fromCharCode(b1));
        }

        //var char = b.readUInt16BE();
        //var d = new Buffer('FA');
        //while(char!=0){
        //    d.writeUInt16BE(char);
        //    char = b.readUInt16BE();
        //}
        //
        //console.log(d.toString());
        //var b1 = b.readUInt16BE();
        //var b1 = b.readUInt8();
        //console.log(b1+':'+String.fromCharCode(b1));


        done();
    });
});