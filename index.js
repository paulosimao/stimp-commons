/**
 * Created by paulo.simao on 23/12/2015.
 */
var EventEmitter = require('events');
var uuid = require('node-uuid');
//var Buffer = require('buffer');
module.exports.CMD_CONNECT = 'CONNECT';
module.exports.CMD_STOMP = 'STOMP';
module.exports.CMD_CONNECTED = 'CONNECTED';
module.exports.CMD_SEND = 'SEND';
module.exports.CMD_SUBSCRIBE = 'SUBSCRIBE';
module.exports.CMD_UNSUBSCRIBE = 'UNSUBSCRIBE';
module.exports.CMD_ACK = 'ACK';
module.exports.CMD_NACK = 'NACK';
module.exports.CMD_BEGIN = 'BEGIN';
module.exports.CMD_COMMIT = 'COMMIT';
module.exports.CMD_ABORT = 'ABORT';
module.exports.CMD_DISCONNECT = 'DISCONNECT';
module.exports.CMD_MESSAGE = 'MESSAGE';
module.exports.CMD_RECEIPT = 'RECEIPT';
module.exports.CMD_ERROR = 'ERROR';

module.exports.createparser = function (sock) {


    var ret = new EventEmitter();
    ret.buffer = '';
    ret.sock = sock;
    ret.chunckcount = 0;
    sock.on('data', function (chunck) {
        //console.log(chunck.toString());
        ret.addchunck(chunck.toString());

    });

    ret.addchunck = function (chunk) {

        ret.buffer += chunk;


        if (ret.buffer.indexOf('\0') > -1) {

            var msgs = ret.buffer.split('\0');
            for (var i = 0; i < msgs.length - 1; i++) {
                var msg = msgs[i];
                if (msg.length > 0) {
                    //console.log('\n=======\n' + msg + '\n===============\n')
                    var parsedmsg = this.parsemsg(msg);


                    ret.emit(parsedmsg.cmd, parsedmsg);
                    ret.buffer = ret.buffer.replace(msg + '\0', '');
                }

            }
            if (ret.buffer.endsWith('\0')) {

                var msg = ret.buffer.split('\0')[0];
                if (msg.length > 0) {
                    //console.log('\n=======\n' + msg + '\n===============\n')
                    var parsedmsg = this.parsemsg(msg);
                    ret.buffer = ret.buffer.replace(msg + '\0', '');
                    ret.emit(parsedmsg.cmd, parsedmsg);
                }

            }
        }
    };

    ret.parsemsg = function (rawmsg) {
        var parts = rawmsg.split('\n');
        var parsedmsg = {
            cmd: parts[0],
            headers: {},
            body: '',
            torawmsg: function () {
                var msgasstr = this.cmd + '\n';
                for (h in parsedmsg.headers) {
                    msgasstr += h + ':' + parsedmsg.headers[h] + '\n';
                }
                msgasstr += '\n' + parsedmsg.body + '\0';
                return msgasstr;
            },
            tosinglelinestr: function () {
                var msg = parsedmsg.torawmsg();
                return msg.buffer.replace(/\n/g, ' ').replace(/\0/g, '\n');
            }
        };
        var i = 1;
        for (; i < parts.length && parts[i].length > 0; i++) {
            var header = parts[i].split(':');
            parsedmsg.headers[header[0]] = header[1];
        }
        i++;
        var body = '';
        for (; i < parts.length && parts[i].length > 0; i++) {

            body += parts[i];
        }
        parsedmsg.body = body;

        return parsedmsg;
    };
    return ret;
};

module.exports.createmsg = function (cmd) {
    ret = {
        cmd: cmd,
        headers: {},
        body: ''
    };

    ret.headers.createdat = new Date().getTime();

    if (cmd === module.exports.CMD_MESSAGE) {
        ret.headers['message-id'] = new uuid.v4();
    }

    ret.torawmsg = function () {
        var msgasstr = cmd + '\n';
        for (h in this.headers) {
            msgasstr += h + ':' + this.headers[h] + '\n';
        }
        msgasstr += '\n' + this.body + '\0';
        return msgasstr;
    };
    ret.addheader = function (h, v) {
        if (ret.headers[h]) {
            throw new Error('Header:' + h + ' already added to this message');
        }
        ret.headers[h] = v;
    };

    ret.addheader('receipt', uuid.v4());

    return ret;
};

module.exports.uuid = function () {
    return uuid.v4();
};