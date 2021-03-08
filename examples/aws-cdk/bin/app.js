#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { DynamoDBStack } = require('../lib/dynamodb-stack');

const app = new cdk.App();
new DynamoDBStack(app, 'DynamoDBStack');
