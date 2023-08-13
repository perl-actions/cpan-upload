import { expect, jest, test, describe } from '@jest/globals';

import * as HttpClient from '@actions/http-client';

describe('normal', () => {
  test('downloadUrl', async () => {
    jest.mock('@actions/http-client', () => ({
      ...HttpClient,
      HttpClient: jest.fn().mockImplementation(() => {
        const resp = {
          message: {
            statusCode: 200,
          },
          readBody: () => 'Query succeeded',
        };
        return {
          post: jest.fn().mockImplementation(() => Promise.resolve(resp)),
        };
      }),
    }));

    const { PAUSEClient } = await import('~/pause-client');

    const client = new PAUSEClient('PAUSEUSER', 'my-password');

    const upload = await client.upload({
      file: './README.md',
    });

    expect(upload.downloadUrl()).toBe(
      'https://www.cpan.org/authors/id/P/PA/PAUSEUSER/README.md'
    );
  });
});
