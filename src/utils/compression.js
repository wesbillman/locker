import execa from 'execa'
import os from 'os'
import uuidv5 from 'uuid/v5'

async function zip(source) {
  const filename = uuidv5(source, uuidv5.URL)
  const zipPath = `${os.tmpdir()}/${filename}.zip`
  await execa('zip', ['-r', zipPath, source], {stdio: 'ignore'});
  return zipPath
}

async function unzip(source) {
    await execa('unzip', [source], {stdio: 'ignore'})
}

export default {zip, unzip}
