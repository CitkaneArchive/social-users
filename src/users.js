/** @module users */

const Sockets = require('./templates/Sockets');
const BaseApi = require('./templates/BaseApi');
const ApiUsers = require('./api/ApiUsers');


const sockets = new Sockets('users');
const { api } = new BaseApi(sockets);
const users = new ApiUsers(sockets, api);
const bffSubscriptions = [
    'users/user-updated',
    'users/user-created',
    'users/user-deleted'
];
api.publish('bff/makesubscriptions', bffSubscriptions);
/**
 * Publishes a list of topics for the bff to subscribe to
 * @event module:users.bff/makesubscriptions
 * @type {Object[]}
 */
/**
 * Publishes a new user
 * @event module:users.users/user-created
 * @type {user}
 */
/**
 * Publishes an updated user
 * @event module:users.users/user-updated
 * @type {user}
 */
/**
 * Publishes a deleted user
 * @event module:users.users/user-deleted
 * @type {user}
 */
const apiInterface = {
    /**
     * @interface
     * @memberof module:users
     * @example <caption>Called from external microservice</caption>
     * api.create('users.<method>', parameter || [parameters], {@link ownerId})
     * */
    create: {
        /**
         * Saves a new user to persistant storage
         * @method module:users.create#user
         * @param {request} request - the standard request wrapper
         * @param {user} request.params -The user object
         * @param {String} request.params.userName -A unique user name.
         * @param {String} [request.params.realName] -The user's real name.
         * @param {String} [request.params.about] -About text for the user.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.create('users.user', {@link user}, {@link ownerId});
         * @returns {(response|response-error)} 201:{@link user}
         * @emits module:users.users/user-created
         * */
        user: request => users.createNewUser(request.args[0], request.ownerId)
            .then(proxyRequest => api.getReqSocket('persistance').proxy(proxyRequest))
            .then((response) => {
                if (response.payload) api.publish('users/user-created', response.payload);
                return response;
            })
    },
    /**
     * @interface
     * @memberof module:users
     * @example <caption>Called from external microservice</caption>
     * api.read('users.<method>', parameter || [parameters], {@link ownerId})
     * */
    read: {
        /**
         * provides a list of topics for the frontend/bff to subscribe to
         * @method module:users.read#bffSubscriptions
         * @param {request} request - the standard request wrapper
         * @param {Object[]} request.params - an empty array
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.read('users.bffSubscriptions', [], {@link ownerId});
         * @returns {(response|response-error)} 200:{Object[string]} an array of topics.
         */
        bffSubscriptions: () => api.resolve(200, bffSubscriptions),
        /**
         * Retrieves all users
         * @method module:users.read#users
         * @param {request} request - the standard request wrapper
         * @param {Object[]} request.params - an empty array
         * @param {ownerId} ownerId -The uid of the entity making the call.
         * @example {@link module:api}.read('users.users', [], {@link ownerId});
         * @returns {(response|response-error)} 200:{@link module:users~users} - an object of {@link user}s indexed by their uid.
         * */
        users: request => api.getReqSocket('persistance').proxy(request),
        /**
         * Retrieves an user by uid
         * @method module:users.read#user
         * @param {request} request - the standard request wrapper
         * @param {string} request.params - The uid of the user.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.read('users.user', 'user123', {@link ownerId});
         * @returns {(response|response-error)} 200:{@link user}.
         * */
        user: request => api.getReqSocket('persistance').proxy(request),
        /**
         * Retrieves an user by username
         * @method module:users.read#userByName
         * @param {request} request - the standard request wrapper
         * @param {string} request.userName - The uid of the user.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.read('users.userByName', 'fred', {@link ownerId});
         * @returns {(response|response-error)} 200:{@link user}.
         * */
        userByName: request => api.getReqSocket('persistance').proxy(request)
    },
    /**
     * @interface
     * @memberof module:users
     * @example <caption>Called from external microservice</caption>
     * api.update('users.<method>', parameter || [parameters], {@link ownerId})
     * */
    update: {
        /**
         * Updates a user to persistant storage
         * @method module:users.update#user
         * @param {request} request - the standard request wrapper
         * @param {user} request.params -The user object
         * @param {String} request.params.userName -A unique user name.
         * @param {String} [request.params.realName] -The user's real name.
         * @param {String} [request.params.about] -About text for the user.
         * @param {String} request.params.uid -The unique id for the user.
         * @param {String} [request.params.created] -The ISO date string of when the user was created.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.update('users.user', {@link user}, {@link ownerId});
         * @returns {(response|response-error)} 200:{@link user} - the updated user
         * @emits module:users.users/user-updated
         * */
        user: request => api.getReqSocket('persistance').proxy(request)
            .then((response) => {
                if (response.payload) api.publish('users/user-updated', response.payload);
                return response;
            })
    },
    /**
     * @interface
     * @memberof module:users
     * @example <caption>Called from external microservice</caption>
     * api.delete('users.<method>', parameter || [parameters], {@link ownerId})
     * */
    delete: {
        /**
         * Deletes a user from persistant storage
         * @method module:users.delete#user
         * @param {request} request - the standard request wrapper
         * @param {user} request.params -The user object
         * @param {String} [request.params.userName] -A unique user name.
         * @param {String} [request.params.realName] -The user's real name.
         * @param {String} [request.params.about] -About text for the user.
         * @param {String} request.params.uid -The unique id for the user.
         * @param {String} [request.params.created] -The ISO date string of when the user was created.
         * @param {ownerId} request.ownerId -The uid of the entity making the call.
         * @example {@link module:api}.delete('users.user', {@link user}, {@link ownerId});
         * @returns {(response|response-error)} 205:{@link user} - the supplied user object
         * @emits module:users.users/user-deleted
         * */
        user: request => api.getReqSocket('persistance').proxy(request)
            .then((response) => {
                if (response.payload) api.publish('users/user-deleted', response.payload);
                return response;
            })
    }
};

sockets.makeResponder(apiInterface);

function gracefulShutdown() {
    console.log('Gracefully shutting down social-users');
    process.exit();
}
module.exports = {
    apiInterface,
    api,
    sockets,
    gracefulShutdown
};
