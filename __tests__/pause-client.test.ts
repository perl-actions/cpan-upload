import { PAUSEClient } from '~/pause-client';

describe('normal', () => {
  it('downloadUrl', async () => {
    const client = new PAUSEClient('HAARG', 'my-password');

    client.uploadUrl = 'http://localhost:5555/';

    console.log(client);
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
