const { MessageConsumerPact, Message, synchronousBodyHandler } = require('@pact-foundation/pact');
const { somethingLike: like, term } = require('@pact-foundation/pact').Matchers;
const path = require('path');

function dogApiHandler(dog) {
    if (!dog.id && !dog.name && !dog.type) {
        throw new Error('missing fields');
    }
}

// 2 Pact Message Consumer
const persistancePact = new MessageConsumerPact({
    consumer: 'social-users',
    dir: path.join(__dirname, '../pactResults'),
    pactfileWriteMode: 'update',
    provider: 'social-persistance',
    logLevel: 'WARN',
    spec: 2
});

describe('receive response to creating a new user', () => {
    it('accepts a valid user object', () => (
        persistancePact
            .given('create.user')
            .expectsToReceive('a request to persist a new user')
            .withContent({
                id: like(1),
                name: like('rover'),
                type: term({ generate: 'bulldog', matcher: '^(bulldog|sheepdog)$' })
            })
            .withMetadata({
                'content-type': 'application/json'
            })

            // 4 Verify consumers' ability to handle messages
            .verify(synchronousBodyHandler(dogApiHandler))
    ));
});
