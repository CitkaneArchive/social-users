/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */

const ports = require('@social/social-deployment/topology/portMaps');
const zmq = require('zmq');

const serverTimeout = 2000;
const serverTimeoutMsg = {
    status: 408,
    message: 'Server timed out for request'
};
const serverErrorMsg = {
    status: 500,
    message: 'internal server error'
};

function makeMessage(ownerId, action, command, args) {
    return JSON.stringify({
        ownerId,
        action,
        command,
        args
    });
}

function GetReqSocket(type) {
    this.type = type;
    this.socket = zmq.socket('req');
}

GetReqSocket.prototype.send = function (ownerId, action, command, args) {
    this.message = makeMessage(ownerId, action, command, args);
    return new Promise((resolve, reject) => {
        const socket = zmq.socket('req');
        socket.connect(`tcp://127.0.0.1:${ports[this.type].crud}`);
        socket.send(this.message);
        const timer = setTimeout(() => {
            socket.close();
            return reject(serverTimeoutMsg);
        }, serverTimeout);
        socket.on('message', (msg) => {
            try {
                const m = JSON.parse(msg.toString());
                resolve(m);
            } catch (err) {
                console.log(err);
                reject(serverErrorMsg);
            } finally {
                clearTimeout(timer);
                socket.close();
            }
        });
    });
};


class BaseApi {
    constructor(responder, subscriber, publish) {
        this.responder = responder;
        this.subscriber = subscriber;
        this.publish = publish;
        this.makeMessage = makeMessage;
    }

    getReqSocket(type) {
        return new GetReqSocket(type);
    }
}

module.exports = BaseApi;
