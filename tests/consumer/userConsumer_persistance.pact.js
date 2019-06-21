/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
const { MessageConsumerPact, synchronousBodyHandler } = require('@pact-foundation/pact');
const path = require('path');
const chai = require('chai');
const dateString = require('chai-date-string');
const { apiInterface, api, gracefulShutdown } = require('../../src/users');

const { expect } = chai;
chai.use(dateString);
const pactsDir = path.join(__dirname, '../pacts');

describe('social-users consumer', () => {
    let messagePact;
    before(() => {
        messagePact = new MessageConsumerPact({
            consumer: 'social-users',
            provider: 'social-persistance',
            pactfileWriteMode: 'update',
            dir: pactsDir,
            logLevel: LOG_LEVEL,
            spec: 2
        });
    });

    after(() => {
        gracefulShutdown();
    });

    it('is running in test environment', () => {
        expect(process.env.NODE_ENV).to.equal('test');
    });

    it('publishes a list of subscription topics to \'bff.makesubscriptions\'', () => {
        let lastMessage;
        let topic;
        let topics;
        try {
            [lastMessage] = api.sockets.publisher._outgoing.lastBatch.content;
            [topic, topics] = JSON.parse(lastMessage.toString());
            topics = JSON.parse(topics);
        } catch (err) {
            throw err;
        }
        expect(topic).to.equal('bff.makesubscriptions');
        expect(topics.length).to.equal(3);
    });
    describe('create.user', () => {
        it('creates a new user object', async () => {
            function handler(response) {
                expect(response.status).to.equal(201);
                expect(response.payload).to.be.an('object');
                expect(response.payload).to.have.keys([
                    'userName',
                    'realName',
                    'about',
                    'uid',
                    'created'
                ]);
                expect(response.payload.uid).to.be.an('string');
                expect(response.payload.uid).to.not.be.empty;
                expect(response.payload.created).to.be.a.dateString();
            }
            let request = await api.makeRequest('create.user', {
                userName: 'testuser',
                realName: 'Test User',
                about: 'About the test user'
            }, 'test-social-users');

            api.getReqSocket().prototype.proxy = (proxyRequest) => {
                request = proxyRequest;
                const newUser = request.args[0];
                return api.resolve(201, newUser);
            };
            const expectedResponse = await apiInterface.create.user(request);

            return messagePact
                .expectsToReceive('persistance.create.user')
                .given(request)
                .withContent(expectedResponse)
                .withMetadata({ 'content-type': 'application/json' })
                .verify(synchronousBodyHandler(handler));
        });

        it('publishes the new user to the \'users.user-created\' event', () => {
            let lastMessage;
            try {
                [lastMessage] = api.sockets.publisher._outgoing.lastBatch.content;
                [lastMessage] = JSON.parse(lastMessage.toString());
            } catch (err) {
                throw err;
            }
            expect(lastMessage[0]).to.equal('users.user-created');
            expect(lastMessage[1]).to.be.an('object');
            expect(lastMessage[1].userName).to.equal('testuser');
        });
    });
});
