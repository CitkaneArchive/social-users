/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
const { MessageProviderPact } = require('@pact-foundation/pact');
const config = require('config');
const axios = require('axios');
const { expect } = require('chai');
const {
    api,
    apiInterface,
    gracefulShutdown
} = require('../../src/users');
const { version } = require('../../package.json');

const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
const pacts = config.get('pacts');
const pactBrokerUrl = `${pacts.broker}:${pacts.brokerPort}`;

function makePact(messageProviders) {
    return new MessageProviderPact({
        messageProviders,
        logLevel: LOG_LEVEL,
        provider: 'social-users',
        providerVersion: version,
        pactBrokerUrl,
        publishVerificationResult: true
    });
}

describe('social-users consumer expectations', async () => {
    const messageProviders = {};
    let persistanceMessages;
    before(async () => {
        const reqPath = `${pactBrokerUrl}/pacts/provider/social-persistance/consumer/social-users/latest`;
        try {
            persistanceMessages = await axios.get(reqPath);
            persistanceMessages = persistanceMessages.data.messages;
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    });

    after(() => {
        setTimeout(() => { gracefulShutdown(); }, 1000);
    });
    describe('ENVIRONMENT', () => {
        it('is running in test environment', () => {
            expect(process.env.NODE_ENV).to.equal('test');
        });
    });
    describe('add consumer requirement contracts to pact', () => {
        describe('CRUD read', () => {
            it('read.bffSubscriptions', () => {
                messageProviders['users.read.bffSubscriptions'] = async (message) => {
                    const request = message.providerStates[0].name;
                    try {
                        return await apiInterface.read.bffSubscriptions(request);
                    } catch (err) {
                        return err;
                    }
                };
            });
        });

        describe('CRUD create', () => {
            it('create.user', async () => {
                let proxyResponse = persistanceMessages.find(message => message.description === 'persistance.create.user');
                const errorMessage = '\nCould not retrieve proxyResponse from the Pact broker.\nHave you run the consumer tests first?\n';
                expect(proxyResponse).to.be.an('object', errorMessage);
                expect(proxyResponse.contents).to.be.an('object', errorMessage);
                proxyResponse = proxyResponse.contents;
                messageProviders['users.create.user'] = async (message) => {
                    const request = message.providerStates[0].name;
                    api.getReqSocket().prototype.proxy = () => {
                        Object.keys(request.args[0]).forEach((key) => {
                            proxyResponse.payload[key] = request.args[0][key];
                        });
                        return api.resolve(proxyResponse.status, proxyResponse.payload);
                    };
                    try {
                        return await apiInterface.create.user(request);
                    } catch (err) {
                        return err;
                    }
                };
            });
            /*
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
            */
        });
    });
    describe('fulfills all contract requirements', () => {
        it('verify against broker', () => makePact(messageProviders).verify());
    });
});
