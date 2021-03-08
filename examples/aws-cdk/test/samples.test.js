const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const { DynamoDBStack } = require('../lib/dynamodb-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    const stack = new DynamoDBStack(app, 'DynamoDBStack');

    expect(stack).to(matchTemplate({ 'Resources': {} }, MatchStyle.EXACT));
});
