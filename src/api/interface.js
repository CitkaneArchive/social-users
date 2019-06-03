/* eslint-disable no-use-before-define */
const ports = require('@social/social-deployment/topology/portMaps');
const zmq = require('zmq');

const publisher = zmq.socket('push');
publisher.bindSync(`tcp://127.0.0.1:${ports.users.pubsub}`);

const subscriber = zmq.socket('sub');
subscriber.connect(`tcp://127.0.0.1:${ports.pubsub}`);


const serverErrorMsg = {
    status: 500,
    message: 'internal server error'
};

function publish(topic, data) {
    try {
        const m = JSON.stringify([topic, data]);
        publisher.send(m);
    } catch (err) {
        console.log(err);
    }
}

const responder = zmq.socket('router');
function throwError(identity, err) {
    console.log(err);
    responder.send([identity, '', serverErrorMsg]);
}

function makeResponder(apiInterface) {
    responder.bindSync(`tcp://127.0.0.1:${ports.users.crud}`);

    responder.on('message', (...args) => {
        const identity = args[0];
        try {
            const request = JSON.parse(args[2].toString());
            if (!apiInterface[request.action] || !apiInterface[request.action][request.command]) return throwError(identity, new Error('Malformed api call'));
            apiInterface[request.action][request.command](request.ownerId, request.args)
                .then((response) => {
                    responder.send([identity, '', JSON.stringify(response)]);
                })
                .catch((err) => {
                    console.log(new Error(err.message));
                    responder.send([identity, '', JSON.stringify(err)]);
                });
        } catch (err) {
            throwError(identity, err);
        }
        return null;
    });
}

module.exports = {
    publish,
    subscriber,
    makeResponder
};
