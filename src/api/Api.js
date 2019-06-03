/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
const uniqid = require('uniqid');
const BaseApi = require('@social/social-deployment/templates/nodejs/api/BaseApi');

class Api extends BaseApi {
    constructor(sockets) {
        super();
        this.sockets = sockets;
        this.ownerId = null;
    }

    createNewUser(user, ownerId = null) {
        const newUser = user;
        newUser.uid = uniqid();
        console.log(newUser);
        return this.api.create('persistance.saveUser', newUser, ownerId)
            .then((response) => {
                console.log(response);
                this.sockets.publish('users.newUser', JSON.stringify(response));
                return response;
            });
    }
}

module.exports = Api;
