/* eslint-disable import/no-extraneous-dependencies */
const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
const { MessageConsumerPact, synchronousBodyHandler, Matchers } = require('@pact-foundation/pact');
const path = require('path');
const { expect } = require('chai');
const types = require('../../src/definitions/typeDefinitions');

const { eachLike, like, term } = Matchers;
const { api, gracefulShutdown } = require('../../src/users');

const pactsDir = path.join(__dirname, '../pacts');

const newIsoDate = new Date(Date.now()).toISOString();
const userObject = types.user('testuser', 'Test User', 'About the test user', newIsoDate, 'testuseruid');
const expectedResponse = types.response(201, userObject);
const request = types.request('social-users', 'create', 'user', userObject);

describe('Pact with social persistance', () => {
    let messagePact;
    /*
    const provider = new Pact({
        consumer: 'social-user',
        provider: 'social-persistance',
        dir: path.join(__dirname, '../pacts'),
        logLevel: LOG_LEVEL,
        spec: 2
    });

    before(() => provider.setup());
    after(() => {
        provider.finalize()
            .then(() => {
                gracefulShutdown();
            });
    });
    afterEach(() => provider.verify());
    */
    after(() => {
        gracefulShutdown();
    });
    describe('when a new user is saved to persistant storage', () => {
        before(() => {
            messagePact = new MessageConsumerPact({
                consumer: 'social-users',
                provider: 'social-persistance',
                dir: pactsDir,
                version: '0.0.0',
                logLevel: LOG_LEVEL,
                spec: 2
            });
            /*
            provider.addInteraction({
                state: 'new user is not persisted',
                uponReceiving: 'a request to save a new user',
                withRequest: api.makeMessage('social-user', 'create', 'user', userObject),
                willRespondWith: expectedResponse
            });
            */
        });
        it('runs the test', () => {
            function testHandler(data) {
                console.log(data);
            }
            return messagePact
                .expectsToReceive('persistance.create.user')
                .given(request)
                .withContent(expectedResponse)
                .verify(synchronousBodyHandler(testHandler));


            /*
            api.api.create('users.user', userObject, 'social-user')
                .then((response) => {
                    console.log(response);
                    expect(1).to.equal(1);
                    done();
                })
                .catch((err) => {
                    console.error('error', err);
                    expect(1).to.equal(1);
                    done();
                });
                */
        });
    });
});
