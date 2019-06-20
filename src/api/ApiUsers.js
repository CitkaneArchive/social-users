const uniqid = require('uniqid');
const Api = require('../templates/Api');

class ApiUsers extends Api {
    constructor(sockets) {
        super(sockets, false);
    }

    createNewUser(user, ownerId = null) {
        const newUser = user;
        newUser.uid = uniqid();
        newUser.created = new Date(Date.now()).toISOString();
        return this.makeRequest('create.user', newUser, ownerId);
    }
}

module.exports = ApiUsers;
