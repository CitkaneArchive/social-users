/* eslint-disable prefer-promise-reject-errors */

const Sockets = require('@social/social-deployment/templates/nodejs/api/Sockets');
const Api = require('./src/api/Api');

const sockets = new Sockets('users');
sockets.subscribe('users.refreshCache');
sockets.subscriber.on('message', (topic, message) => {
    console.log('received a message related to:', topic.toString(), 'containing message:', message.toString());
});
setTimeout(() => {
    sockets.publish('users.newUser', 'testing pubsub');
}, 5000);
const api = new Api(sockets);

const apiInterface = {
    create: {
        newUser: request => api.createNewUser(request.args[0], request.ownerId)
            .then(payload => ({ status: 201, payload }))
    },
    read: {},
    update: {},
    delete: {}
};

sockets.makeResponder(apiInterface);
