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
     * @property {Number} status - The response code as to HTTP schema.
     * @property {String} ownerId - The uid of the entity which made the api call;
     * @property {any} payload - The api response payload.
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
     * @property {String} ownerId - The uid of the entity which made the api call;
     * @property {any} payload - The api response payload.
     */
    response: (status, payload) => ({
        status,
        payload
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
