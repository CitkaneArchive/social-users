/* eslint-disable prefer-promise-reject-errors */

const Api = require('./src/api/Api');
const { makeResponder, subscriber, publish } = require('./src/api/interface');

subscriber.subscribe('users.refreshCache');
subscriber.on('message', (topic, message) => {
    console.log('received a message related to:', topic.toString(), 'containing message:', message.toString());
});

const api = new Api(subscriber, publish);

const apiInterface = {
    create: {
        newUser: (ownerId, args) => api.createNewUser(ownerId, ...args)
            .then(payload => ({ status: 201, payload }))
            .catch(err => Promise.reject({ status: err.status || 500, message: err.message }))
    },
    read: {},
    update: {},
    delete: {}
};

makeResponder(apiInterface);
