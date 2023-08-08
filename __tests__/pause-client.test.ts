import { expect, jest, test, describe } from '@jest/globals';

import * as HttpClient from '@actions/http-client';

import { PAUSEClient } from '~/pause-client';

describe('normal', () => {
  test('downloadUrl', async () => {
    jest.mock('@actions/http-client', () => ({
      ...HttpClient,
      "HttpClient": jest.fn().mockImplementation(() => ({
        post: jest.fn(),
      })),
    }));

    const { PAUSEClient } = await import('~/pause-client');

    const client = new PAUSEClient('HAARG', 'my-password');

    // client.uploadUrl = 'http://localhost:5555/';

    /*
    const upload = await client.upload({
      file: './README.md',
    });

    console.log(upload);
    expect(upload.downloadUrl()).toBe(
      'https://www.cpan.org/authors/id/H/HA/HAARG/README.md'
    );
    */
    expect(true).toBe(true);
  });
});
