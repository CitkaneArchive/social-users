/* eslint-disable class-methods-use-this */
const uniqid = require('uniqid');
const Api = require('../templates/Api');

let api;

/** @memberof module:users */
class ApiUsers extends Api {
    /**
     * @classdesc methods to manipulate users data
     * @param {Sockets} sockets -The zmq socket class instance.
     */
    constructor(sockets, baseApi) {
        super(sockets, false);
        api = baseApi;
    }

    createNewUser(user, ownerId = null) {
        const newUser = user;
        newUser.uid = uniqid();
        newUser.created = new Date(Date.now()).toISOString();
        return api.makeRequestObject('create.user', newUser, ownerId);
    }
}

module.exports = ApiUsers;
