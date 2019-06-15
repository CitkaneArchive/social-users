const uniqid = require('uniqid');
const Api = require('../../../social-deployment/templates/nodejs/api/Api');

class ApiUsers extends Api {
    constructor(sockets) {
        super(sockets, false);
    }

    createNewUser(user, ownerId = null) {
        const newUser = user;
        newUser.uid = uniqid();
        return this.api.create('persistance.user', newUser, ownerId)
            .then(response => this.checkStatus(response));
    }
}

module.exports = ApiUsers;
