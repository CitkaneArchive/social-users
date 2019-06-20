/**
 * The uid of the entity making the api call.
 *
 * This should be passed in from the previous service call and originates in the frontend/bff service.
 *
 * It can be overridden at the api interface level.
 * @typedef  {String} ownerId
 *
*/

module.exports = {
    /**
     * @typedef request
     * @property {String} ownerId - The uid of the entity which made the api call;
     * @property {String} action - The CRUD action to be called;
     * @property {String} command - The corresponding command invocation for the CRUD operation;
     * @property {(String|Object[])} args - The arguments to pass to the command.
     */
    request: (ownerId, action, command, args = []) => {
        let thisArgs = args;
        if (!Array.isArray(thisArgs)) thisArgs = [thisArgs];
        return {
            ownerId,
            action,
            command,
            args: thisArgs
        };
    },

    /**
     * @typedef response
     * @property {Number} status - The response code as to HTTP schema.
     * @property {any} payload - The api response payload.
     */
    response: (status, payload) => ({
        status,
        payload
    }),
    /**
     * @typedef response-error
     * @property {Number} status - The response code as to HTTP schema.
     * @property {any} message - The api response error.
     */
    error: (status, message) => ({
        status,
        message
    }),
    /**
     * @typedef user
     * @property {String} userName -A unique user name.
     * @property {String} [realName] -The user's real name.
     * @property {String} [about] -About text for the user.
     * @property {String} created -The ISO date string of when the user was created.
     * @property {String} uid -The unique id for the user.
     */
    user: (userName, realName = '', about = '', created, uid) => ({
        userName,
        realName,
        about,
        created,
        uid
    })
};
