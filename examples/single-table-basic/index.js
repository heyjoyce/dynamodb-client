const AWS = require('aws-sdk');
const { createContext, insert, find } = require('dynaglue');

// Declare the layout of your table (its primary and secondary indexes and their key names)
const layout = {
  tableName: 'Global-dev',
  primaryKey: { partitionKey: 'id', sortKey: 'collection' },
  findKeys: [
    // Up to acccess patterns
    { indexName: 'gsi2', partitionKey: 'gsi2p', sortKey: 'gsi2s' },
    { indexName: 'gsi3', partitionKey: 'gsi3p', sortKey: 'gsi3s' },
  ],
};

// Declare a collection for each data type (like a Mongo collection)
const feedsCollection = {
  layout,
  name: 'feeds',
  // access patterns that are mapped to indexes in the table layout
  accessPatterns: [
    { indexName: 'gsi2', partitionKeys: [['type'], ['is_pinned']], sortKeys: [['updated_at']] },
    { indexName: 'gsi3', partitionKeys: [['type'], ['author', 'id']], sortKeys: [['created_at']] },
  ],
};

const commentsCollection = {
  layout,
  name: 'comments',
  type: 'child',
  foreignKeyPath: ['feed_id'],
  parentCollectionName: 'feeds',
};

AWS.config.update({ region: 'ap-northeast-2' });

const ddb = new AWS.DynamoDB();
const ctx = createContext(ddb, [feedsCollection, commentsCollection]);

const insertFeed = async ({ type, title, body, author, is_pinned, updated_at, created_at }) => {
  return await insert(ctx, 'feeds', { type, title, body, author, is_pinned, updated_at, created_at });
}

const findFeeds = async ({ type, is_pinned }) => {
  const query = {
    type,
    ...(is_pinned && { is_pinned }),
  }
  const options = {
    scanForward: true,
    limit: 50,
  }
  return find(ctx, 'feeds', query, null, options);
}

const insertComment = async ({ feed_id, body, author, updated_at, created_at }) => {
  return await insert(ctx, 'comments', { feed_id, body, author, updated_at, created_at });
}

module.exports = {
  insertFeed,
  insertComment,
  findFeeds,
}