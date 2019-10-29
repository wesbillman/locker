import chalk from 'chalk'
import execa from 'execa'
import os from 'os'
import uuidv5 from 'uuid/v5'

const log = console.log;

async function zip(source) {
  const filename = uuidv5(source, uuidv5.URL)
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
