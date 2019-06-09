/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
const uniqid = require('uniqid');
const BaseApi = require('../../../social-deployment/templates/nodejs/api/BaseApi');

class Api extends BaseApi {
    constructor(sockets) {
        super();
        this.sockets = sockets;
        this.ownerId = null;
    }

    createNewUser(user, ownerId = null) {
        const newUser = user;
        newUser.uid = uniqid();
        return this.api.create('persistance.user', newUser, ownerId)
            .then((response) => {
                this.sockets.publish('users.newUserCreated', JSON.stringify(response));
                return this.checkStatus(response);
            });
    }

    getAllUsers(ownerId = null) {
        return this.api.read('persistance.users', null, ownerId)
            .then(this.checkStatus);
    }

    getUserById(uid, ownerId = null) {
        return this.api.read('persistance.user', uid, ownerId)
            .then(this.checkStatus);
    }

    updateUser(user, ownerId = null) {
        return this.api.update('persistance.user', user, ownerId)
            .then(this.checkStatus);
    }

    deleteUser(user, ownerId = null) {
        return this.api.delete('persistance.user', user, ownerId)
            .then(this.checkStatus);
    }
}

module.exports = Api;
