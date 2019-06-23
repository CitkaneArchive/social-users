const uniqid = require('uniqid');
const Api = require('../templates/Api');

/** @memberof module:users */
class ApiUsers extends Api {
    /**
     * @classdesc methods to manipulate users data
     * @param {Sockets} sockets -The zmq socket class instance.
     */
    constructor(sockets) {
        super(sockets, false);
    }

    createNewUser(user, ownerId = null) {
        const newUser = user;
        newUser.uid = uniqid();
        newUser.created = new Date(Date.now()).toISOString();
        return this.makeRequestObject('create.user', newUser, ownerId);
    }
}

module.exports = ApiUsers;
