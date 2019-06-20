/* eslint-disable func-names */
/* eslint-disable import/no-extraneous-dependencies */
const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
const { MessageConsumerPact, synchronousBodyHandler, Matchers } = require('@pact-foundation/pact');
const path = require('path');
const { expect } = require('chai');

const { eachLike, like, term } = Matchers;
const { apiInterface, api, gracefulShutdown } = require('../../src/users');

const pactsDir = path.join(__dirname, '../pacts');

describe('social-users consumer', () => {
    let messagePact;
    before(() => {
        messagePact = new MessageConsumerPact({
            consumer: 'social-users',
            provider: 'social-persistance',
            dir: pactsDir,
            logLevel: LOG_LEVEL,
            spec: 2
        });
    });

    after(() => {
        gracefulShutdown();
    });

    it('creates.user', async () => {
        function makeUserHandler(data) {
            console.log(data);
        }

        let request = await api.makeRequest('create.user', {
            userName: 'testuser',
            realName: 'Test User',
            about: 'About the test user'
        }, 'test-social-users');

        api.getReqSocket().prototype.proxy = function (proxyRequest) {
            request = proxyRequest;
            const newUser = request.args[0];
            return api.resolve(201, newUser);
        };
        const expectedResponse = await apiInterface.create.user(request);

        return messagePact
            .expectsToReceive('persistance.create.user')
            .given(request)
            .withContent(expectedResponse)
            .verify(synchronousBodyHandler());
    });
});
