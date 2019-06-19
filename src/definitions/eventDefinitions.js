/**
 * **Publishes a newly created user.**
 * @event module:users.event:"users.user-created"
 * @type {module:users.pubsub#publish}
 * @param {String} topic - users.user-created
 * @param {user} payload - The newly created user object.
 */

/**
 * **Runs at the microservice startup** to inform the frontend/bff which topics are for frontend subscription.
 * @event module:users.event:"bff.makesubscriptions"
 * @type {module:users.pubsub#publish}
 * @param {string} topic - bff.makesubscriptions
 * @param {Object[]} bffSubscriptions - An array of topics that the users microservice wants the frontend/bff to subscribe to.
 * @param {...string} bffSubscriptions[].topic
 */
