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

const apiInterface = {
    /**
     * **Create for CRUD operations**
     * @namespace module:users.create
     * @example api.create('users.<method>', parameter || [parameters], {@link ownerId})
     * */
    create: {
        /**
         * **Creates a new user** and saves them persistant storage
         * @method module:users.create#user
         * @param {user} user -The user object
         * @param {String} user.userName -A unique user name.
         * @param {String} [user.realName] -The user's real name.
         * @param {String} [user.about] -About text for the user.
         * @param {String} user.uid -The unique id for the user.
         * @param {String} user.created -The ISO date string of when the user was created.
         * @param {ownerId} ownerId -The uid of the entity making the call.
         * @example api.create('users.user', {@link user}, {@link ownerId});
         * @returns {response} An api response wrapper with a {@link user} object if successful;
         * @fires module:users.event:"users.user-created"
         * */
        user: request => api.createNewUser(request.args[0], request.ownerId)
            .then((response) => {
                api.publish('users.user-created', response.payload);
                return response;
            })
            .catch(err => err)
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
                api.publish('users.user-updated', response.payload);
                return response;
            })
    },
    delete: {
        user: request => api.getReqSocket('persistance').proxy(request)
            .then((response) => {
                api.publish('users.user-deleted', response.payload);
                return response;
            })
    }
};

sockets.makeResponder(apiInterface);
