/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
const uniqid = require('uniqid');
const BaseApi = require('./BaseApi');

class Api extends BaseApi {
    constructor(subscriber, publish) {
        super(subscriber, publish);
    }

    createNewUser(ownerId, user) {
        const newUser = user;
        newUser.uid = uniqid();
        const socket = this.getReqSocket('persistance');
        return socket.send(ownerId, 'create', 'newUser', [newUser])
            .then((response) => {
                this.publish('users.newUser', JSON.stringify(response));
                console.log('got the response');
                return response;
            })
            .catch(err => Promise.reject(err));
    }
}

module.exports = Api;
