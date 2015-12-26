/**
 * Created by paulo.simao on 23/12/2015.
 */

var parser = require('../index').createparser();

describe('Parsing  Test', function () {
    it('Parsing Test', function (done) {
        parser.on('msg', function (msg) {
            console.log(msg);
        });
        parser.addchunck('CONNECT\na:1\nb:2\n\nteste123\0');

        done();
    });
});