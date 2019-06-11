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
            .then(response => this.checkStatus(response));
    }
}

module.exports = Api;
