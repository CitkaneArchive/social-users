const Sockets = require('../../social-deployment/templates/nodejs/api/Sockets');
const ApiUsers = require('./api/ApiUsers');

const sockets = new Sockets('users');
const api = new ApiUsers(sockets);

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
        user: request => api.getReqSocket('persistance').proxy(request)
            .then((response) => {
                sockets.publish('users.user-updated', response.payload);
                return response;
            })
            .catch(err => err)
    },
    delete: {
        user: request => api.getReqSocket('persistance').proxy(request)
            .then((response) => {
                sockets.publish('users.user-deleted', response.payload);
                return response;
            })
            .catch(err => err)
    }
};

sockets.makeResponder(apiInterface);
