module.exports = {
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

/**
 * @typedef module:users~users
 * @property {user} uid - an object of {@link user}s indexed by their uid.
 */
