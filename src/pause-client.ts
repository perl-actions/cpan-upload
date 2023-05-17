import { HttpClient, type HttpClientResponse } from '@actions/http-client';
import { BasicCredentialHandler } from '@actions/http-client/auth';
import FormData from 'form-data';
import { type OutgoingHttpHeaders } from 'http';
import { readFile } from 'node:fs/promises';
import * as path from 'path';
import { promisify } from 'util';
import { CPANUpload } from './cpan-distname-info';

export interface FileUpload {
  file: string;
  filename?: string;
  directory?: string;
}

async function getRequestData(
  form: FormData
): Promise<[string, OutgoingHttpHeaders]> {
  const getLength = promisify(form.getLength.bind(form));
  const headers: OutgoingHttpHeaders = {
    ...form.getHeaders(),
    'Content-Length': await getLength(),
  };

  return [form.getBuffer().toString(), headers];
}

export class PAUSEClient {
  readonly #client: HttpClient;
  public uploadUrl: string =
    'https://pause.perl.org/pause/authenquery?ACTION=add_uri';

  constructor(readonly username: string, password: string) {
    const credentials = new BasicCredentialHandler(username, password);

    this.#client = new HttpClient('perl-actions/cpan-upload', [credentials]);
  }

  async upload(filedata: FileUpload): Promise<CPANUpload> {
    const form = new FormData();
    form.append('HIDDENNAME', this.username);
    form.append(
      'SUBMIT_pause99_add_uri_httpupload',
      ' Upload this file from my disk '
    );
    form.append('pause99_add_uri_uri', '');
    form.append('CAN_MULTIPART', '1');

    if (filedata.directory != null) {
      form.append('pause99_add_uri_subdirtext', filedata.directory);
    }

    const filename = filedata.filename ?? path.basename(filedata.file);
    form.append('pause99_add_uri_upload', await readFile(filedata.file), {
      filename,
      contentType: 'application/gzip',
    });

    const res: HttpClientResponse = await this.#client.post(
      this.uploadUrl,
      ...(await getRequestData(form))
    );

    const code = res.message.statusCode;

    if (code === 200) {
      const body = await res.readBody();
      if (body.match(/Query succeeded/) == null) {
        throw new Error(
          `Unknown error uploading ${filename} for user ${this.username}`
        );
      }
    } else if (code === 409) {
      throw new Error(`Duplicate file ${filename} for user ${this.username}`);
    } else {
      let err = code ?? 'Unknown';
      if (res.message.statusMessage != null) {
        err = `${err} ${res.message.statusMessage}`;
      }
      throw new Error(
        `Unknown error "${err}" uploading ${filename} for user ${this.username}`
      );
    }

    const author = this.username;
    const info = new CPANUpload(filename);
    info.author = author;
    if (filedata.directory != null) {
      info.directory = filedata.directory;
    }

    return info;
  }
}
