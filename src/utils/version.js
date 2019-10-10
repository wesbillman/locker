import fs from 'fs-extra'

const log = console.log
const versionFilePath = '.lockerversion'

function checkVersion(doc, force) {
  if (!fs.existsSync(versionFilePath)) {
    return
  }

  const file = fs.readFileSync(versionFilePath, 'utf8')
  if (file == doc.version && !force) {
    log(`You already have version ${doc.version} locally.`)
    log('Use "locker pull -f" to force pull the version again')
    process.exit(0)
  }

}

function createVersionFile(doc) {
  const version = doc.version
  fs.writeFileSync(versionFilePath, version)
}

export default {checkVersion, createVersionFile}
