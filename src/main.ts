import * as core from '@actions/core';
import { PAUSEClient } from './pause-client';

async function run(): Promise<void> {
  const username = core.getInput('username');
  const password = core.getInput('password');
  const file = core.getInput('file');
  const filename = core.getInput('filename');
  const directory = core.getInput('directory');

  const client = new PAUSEClient(username, password);
  const upload = await client.upload({
    file,
    filename,
    directory,
  });

  core.setOutput('download-url', upload.downloadUrl());
  core.setOutput('metacpan-url', upload.metacpanUrl());
}

void (async (): Promise<void> => {
  try {
    await run();
  } catch (error: any) {
    core.setFailed(error.message);
  }
})();
