import chalk from 'chalk'
import fs from 'fs-extra'
import os from 'os'
import trash from 'trash'

const log = console.log;

async function push(doc, force) {
  let lockerPath = getLockerPath(doc)
  if (!lockerPath) {
    return
  }

  if (!fs.existsSync(lockerPath) || force) {
    await trash(lockerPath)
    fs.mkdirSync(lockerPath)
    log(chalk.green(`${lockerPath} created for local storage`))
  } else {
    log(chalk.red(`Locker already exist at: ${lockerPath}`))
    log('Use "locker push -f" to overwrite')
    process.exit(1)
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

  if (!fs.existsSync(lockerPath)) {
    log(chalk.red(`Locker not found at: ${lockerPath}`))
    log('Make sure you push updates to a new locker before trying to pull')
    process.exit(1)
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
  return `${localPath}/${doc.version}`
}

function verifyExists(element, action) {
  if (!fs.existsSync(element)) {
    log('')
    log(chalk.red(`ERROR - cannot ${action} ${element}. ${element} does not exist.`))
    process.exit(1)
  }
}
