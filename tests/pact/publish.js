/* eslint-disable import/no-extraneous-dependencies */
const config = require('config');
const pact = require('@pact-foundation/pact-node');
const path = require('path');
const { version } = require('../../package.json');

const opts = {
    pactFilesOrDirs: [path.resolve(__dirname, '../pactResults/')],
    pactBroker: config.get('network').pacts,
    tags: ['prod', 'test'],
    consumerVersion: version
};

pact
    .publishPacts(opts)
    .then(() => {
        console.log('Pact contract publishing complete!');
        console.log('');
        console.log(`Head over to ${config.get('network').pacts}`);
        console.log('to see your published contracts.');
    })
    .catch((e) => {
        console.log('Pact contract publishing failed: ', e);
    });
