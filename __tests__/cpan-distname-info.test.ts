import { CPANUpload } from '~/cpan-distname-info';

describe('normal', () => {
  const dist = new CPANUpload(
    'https://cpan.metacpan.org/authors/id/H/HA/HAARG/Moo-2.005005.tar.gz'
  );

  it('domain', async () => {
    expect(dist.domain).toBe('cpan.metacpan.org');
  });
  it('mirror', async () => {
    expect(dist.mirror).toBe('https://cpan.metacpan.org/');
  });
  it('author', async () => {
    expect(dist.author).toBe('HAARG');
  });
  it('directory', async () => {
    expect(dist.directory).toBe(undefined);
  });
  it('filename', async () => {
    expect(dist.filename).toBe('Moo-2.005005.tar.gz');
  });
  it('release', async () => {
    expect(dist.release).toBe('Moo-2.005005');
  });
  it('extension', async () => {
    expect(dist.extension).toBe('tar.gz');
  });
  it('distribution', async () => {
    expect(dist.distribution).toBe('Moo');
  });
  it('version', async () => {
    expect(dist.version).toBe('2.005005');
  });
  it('maturity', async () => {
    expect(dist.maturity).toBe('released');
  });

  it('downloadUrl', async () => {
    expect(dist.downloadUrl()).toBe(
      'https://cpan.metacpan.org/authors/id/H/HA/HAARG/Moo-2.005005.tar.gz'
    );
  });
  it('metacpanUrl', async () => {
    expect(dist.metacpanUrl()).toBe(
      'https://metacpan.org/release/HAARG/Moo-2.005005'
    );
  });
});
