/* eslint-disable prefer-promise-reject-errors */

const Sockets = require('../social-deployment/templates/nodejs/api/Sockets');
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
        user: request => api.createNewUser(request.args[0], request.ownerId)
            .then((response) => {
                sockets.publish('users.user-created', response.payload);
                return response;
            })
            .catch(err => err)
    },
    read: {
        users: request => api.getReqSocket('persistance').proxy(request),

        user: request => api.getReqSocket('persistance').proxy(request),

        userByName: request => api.getReqSocket('persistance').proxy(request)
    },
    update: {
        user: request => api.updateUser(request.args[0], request.ownerId)
            .then((payload) => {
                sockets.publish('users.user-updated', payload);
                return { status: 200, payload };
            })
    },
    delete: {
        user: request => api.deleteUser(request.args[0], request.ownerId)
            .then((payload) => {
                sockets.publish('users.user-deleted', payload);
                return { status: 200, payload };
            })
    }
};

sockets.makeResponder(apiInterface);
