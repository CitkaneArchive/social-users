/** @module users */

const Sockets = require('./templates/Sockets');
const ApiUsers = require('./api/ApiUsers');

const sockets = new Sockets('users');
const api = new ApiUsers(sockets);
const bffSubscriptions = [
    'users.user-updated',
    'users.user-created',
    'users.user-deleted'
];
api.publish('bff.makesubscriptions', bffSubscriptions);

/**
 * **The public interface to the Api**
 * @memberof module:users
 * */
const apiInterface = {
    create: {
        user: request => api.createNewUser(request.args[0], request.ownerId)
            .then(proxyRequest => api.getReqSocket('persistance').proxy(proxyRequest))
            .then((response) => {
                if (response.payload) api.publish('users.user-created', response.payload);
                return response;
            })
    },
    read: {
        bffSubscriptions: () => api.resolve(200, bffSubscriptions),

        users: request => api.getReqSocket('persistance').proxy(request),

        user: request => api.getReqSocket('persistance').proxy(request),

        userByName: request => api.getReqSocket('persistance').proxy(request)
    },
    update: {
        user: request => api.getReqSocket('persistance').proxy(request)
            .then((response) => {
                if (response.payload) api.publish('users.user-updated', response.payload);
                return response;
            })
    },
    delete: {
        user: request => api.getReqSocket('persistance').proxy(request)
            .then((response) => {
                if (response.payload) api.publish('users.user-deleted', response.payload);
                return response;
            })
    }
};

sockets.makeResponder(apiInterface);

function gracefulShutdown() {
    console.log('Gracefully shutting down social-users');
    process.exit();
}
module.exports = { apiInterface, api, gracefulShutdown };
