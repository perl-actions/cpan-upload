const urlRe =
  /^(?:(?:(?:((?:https?|ftp):\/\/([^/]+)(?=\/).*?\/|file:\/\/.*?\/)?authors\/)?id\/)?([A-Z])\/(\3[A-Z])\/(\4[-A-Z0-9]*)\/)?(.*\/)?([^/]+)$/;

const extRe = /^(.+)\.(tar\.(?:g?z|bz2)|zip|tgz)$/;

const versionRe =
  /^((?:[-+.]*(?:[A-Za-z0-9]+|(?<=\D)_|_(?=\D))*(?:[A-Za-z](?=[^A-Za-z]|$)|\d(?=-))(?<![._-][vV]))+)(.*)/;

const perlDevRe = /^perl-?(\d+)\.(\d+)(?:\D(\d+))?(-(?:TRIAL|RC)\d+)?$/;

enum Maturity {
  Developer = 'developer',
  Released = 'released',
}

export class CPANUpload {
  public domain?: string;
  public mirror?: string;
  public author?: string;
  public directory?: string;
  public filename: string;
  public release?: string;
  public extension?: string;
  public distribution?: string;
  public version?: string;
  public maturity?: Maturity;

  constructor(url: string) {
    const urlMatch = urlRe.exec(url);

    if (urlMatch == null) {
      throw new Error('Invalid file name provided!');
    }

    const [, mirror, domain, , , author, directory, filename] = urlMatch;

    if (mirror != null) {
      this.mirror = mirror;
    }
    if (domain != null) {
      this.domain = domain;
    }
    if (author != null) {
      this.author = author;
    }
    if (directory != null) {
      this.directory = directory;
    }
    this.filename = filename;

    const extMatch = extRe.exec(filename);
    if (extMatch == null) {
      return;
    }

    [, this.release, this.extension] = extMatch;

    const versionMatch = versionRe.exec(this.release);
    if (versionMatch == null) {
      return;
    }

    let dist: string;
    let version: string;
    [, dist, version] = versionMatch;

    if (version.length === 0) {
      dist = dist.replace(/-undef$/, '');
    }
    version = version.replace(/-withoutworldwriteables$/, '');

    let versionExtra;
    if ((versionExtra = version.match(/^(-[Vv].*)-(\d.*)/)) != null) {
      dist += versionExtra[1];
      version = versionExtra[2];
    }

    if ((versionExtra = version.match(/(.+_.*)-(\d.*)/)) != null) {
      dist += versionExtra[1];
      version = versionExtra[2];
    }

    dist = dist.replace(/\.pm$/, '');

    if (version.length === 0) {
      if ((versionExtra = dist.match(/^(.*)-(\d+\w)$/)) != null) {
        [, dist, version] = versionExtra;
      }
    }
    if (version.match(/^\d+$/) != null) {
      if ((versionExtra = dist.match(/^(.*)-(\w+)$/)) != null) {
        dist = versionExtra[1];
        version += versionExtra[2];
      }
    }
    if (version.match(/\d\.\d/) != null) {
      version = version.replace(/^[-_.]+/, '');
    } else {
      version = version.replace(/^[-_]+/, '');
    }

    this.distribution = dist;
    this.version = version;

    let dev = false;
    if (version.length !== 0) {
      const perlDevMatch = perlDevRe.exec(this.release);
      if (perlDevMatch != null) {
        const major = +perlDevMatch[1];
        const minor = +perlDevMatch[2];
        const patch = +perlDevMatch[3];
        const trial = perlDevMatch[4];
        if (trial.length != null) {
          dev = true;
        } else if (major === 5 && minor < 6) {
          if (patch >= 50) {
            dev = true;
          }
        } else if (major === 5 && minor === 6) {
          // noop
        } else if (major >= 5) {
          if (patch % 2 === 1) {
            dev = true;
          }
        }
      } else {
        if (
          version.match(/\d\D\d+_\d/) != null ||
          version.match(/-TRIAL/) != null
        ) {
          dev = true;
        }
      }
    }
    this.maturity = dev ? Maturity.Developer : Maturity.Released;
  }

  uriid(): string {
    const author = this.author;
    if (author == null) {
      throw new Error('not available without an author');
    }
    const directory = this.directory;
    const filename = this.filename;

    return `${author.substring(0, 1)}/${author.substring(0, 2)}/${author}/${directory == null ? '' : directory+'/'}${filename}`;
  }

  downloadUrl(mirror?: string): string {
    mirror ??= this.mirror ?? 'https://www.cpan.org/';

    return `${mirror}authors/id/${this.uriid()}`;
  }

  metacpanUrl(): string {
    if (this.author == null) {
      throw new Error('not available without an author');
    }
    if (this.release == null) {
      throw new Error(
        'not available without a release'
      );
    }

    return `https://metacpan.org/release/${this.author}/${this.release}`;
  }
}
