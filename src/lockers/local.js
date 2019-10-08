import chalk from 'chalk'
import fs from 'fs-extra'
import os from 'os'
const log = console.log;

function push(doc) {
  let lockerPath = getLockerPath(doc)
  if (!lockerPath) {
    return
  }

  log(`Putting gear in your ${chalk.magenta('local')} locker`)
  log(chalk.gray(lockerPath))

  const allPaths = (doc.gear.folders || []).concat(doc.gear.files || [])
  allPaths.forEach(source => {
    process.stdout.write(`Pushing - ${chalk.magenta(source)}...`)
    verifyExists(source, 'push')
    fs.copySync(source, `${lockerPath}/${source}`)
    log(chalk.green('✓'))
  });
}

function pull(doc) {
  let lockerPath = getLockerPath(doc)
  if (!lockerPath) {
    return
  }
  log(`Getting gear out of your ${chalk.magenta('local')} locker`)
  log(chalk.gray(lockerPath))

  const allPaths = (doc.gear.folders || []).concat(doc.gear.files || [])
  allPaths.forEach(destination => {
    process.stdout.write(`Pulling - ${chalk.magenta(destination)}...`)
    const source = `${lockerPath}/${destination}`
    verifyExists(source, 'pull')

    const stats = fs.lstatSync(source)

    if (stats.isDirectory()) {
      fs.removeSync(destination)
    }

    fs.copySync(source, destination)
    log(chalk.green('✓'))
  });
}

export default {pull, push}

function getLockerPath(doc) {
  if (!doc.lockers.local) {
    return null
  }
  let localPath = doc.lockers.local.replace(/^~/, os.homedir());
  localPath = `${localPath}/${doc.version}`
  if (!fs.existsSync(localPath)) {
    fs.mkdirSync(localPath)
    log(chalk.green(`${localPath} created for local storage`))
  }
  return localPath
}

function verifyExists(element, action) {
  if (!fs.existsSync(element)) {
    log('')
    log(chalk.red(`ERROR - cannot ${action} ${element}. ${element} does not exist.`))
    process.exit(1)
  }
}
