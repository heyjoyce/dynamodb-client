const { insertFeed, insertComment, findFeeds } = require('./index'); 

describe('feed', () => {
  test('insert', async () => {
    const feed = await insertFeed({
      type: 'qna',
      title: 'How to start DynamoDB?',
      body: 'Blah-Blah',
      author: {
        id: '100',
        username: 'Minhyeok'
      },
      is_pinned: 'TRUE',
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
  
    const comment = await insertComment({
      feed_id: feed._id,
      body: 'Sounds great!',
      author: {
        id: '101',
        username: 'Che'
      },
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
  
    expect(comment.feed_id).toBe(feed._id);
  });

  test('find', async () => {
    const { items, nextToken } = await findFeeds({ type: 'qna', is_pinned: 'TRUE' });

    expect(Array.isArray(items)).toBeTruthy();
    expect(nextToken).toBeFalsy();
  });
});
