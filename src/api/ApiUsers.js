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
        return this.api.create('persistance.user', newUser, ownerId)
            .then(response => this.checkStatus(response));
    }
}

module.exports = ApiUsers;
