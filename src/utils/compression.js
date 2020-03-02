import chalk from 'chalk'
import execa from 'execa'
import os from 'os'
import { v4 as uuidv4 } from 'uuid';

const log = console.log;

async function zip(source) {
  const filename = uuidv4()
  const zipPath = `${os.tmpdir()}/${filename}.zip`
  await execa('zip', ['-r', zipPath, source], {stdio: 'ignore'});
  return zipPath
}

async function unzip(source) {
  try {
    await execa('unzip', ['-o', source], {stdio: 'ignore'})
  } catch (error) {
    log(chalk.red(`ERROR - ${error}`))
  }
}

export default {zip, unzip}
