import chalk from 'chalk'
import fs from 'fs-extra'
import os from 'os'
const log = console.log;

function push(doc) {
  let localPath = getLocalPath(doc)
  if (!localPath) {
    return
  }

  log(`Putting gear in your ${chalk.magenta('local')} locker`)
  log(chalk.gray(localPath))

  doc.gear.directories.forEach(element => {
    process.stdout.write(`Pushing dir  - ${chalk.green(element)}...`)
    verifyExists(element, 'directory', 'push')
    fs.copySync(element, `${localPath}/${element}`)
    log(chalk.green('✓'))
  });

  doc.gear.files.forEach(element => {
    process.stdout.write(`Pushing file - ${chalk.green(element)}...`)
    verifyExists(element, 'file', 'push')
    fs.copySync(element, `${localPath}/${element}`)
    log(chalk.green('✓'))
  });
}

function pull(doc) {
  let localPath = getLocalPath(doc)
  if (!localPath) {
    return
  }
  log(`Getting gear out of your ${chalk.magenta('local')} locker`)
  log(chalk.gray(localPath))

  doc.gear.directories.forEach(element => {
    process.stdout.write(`Pulling dir  - ${chalk.green(element)}...`)
    verifyExists(`${localPath}/${element}`, 'directory', 'pull')
    fs.removeSync(element)
    fs.copySync(`${localPath}/${element}`, element)
    log(chalk.green('✓'))
  });

  doc.gear.files.forEach(element => {
    process.stdout.write(`Pulling file - ${chalk.green(element)}...`)
    verifyExists(`${localPath}/${element}`, 'file', 'pull')
    fs.copySync(`${localPath}/${element}`, element)
    log(chalk.green('✓'))
  });
}

export default {pull, push}

function getLocalPath(doc) {
  if (!doc.lockers.local) {
    return null
  }
  let localPath = doc.lockers.local.replace(/^~/, os.homedir());
  localPath = `${localPath}/${doc.team}`
  if (!fs.existsSync(localPath)) {
    fs.mkdirSync(localPath)
    log(chalk.green(`${localPath} created for local storage`))
  }
  return localPath
}

function verifyExists(element, type, action) {
  if (!fs.existsSync(element)) {
    log('')
    log(chalk.red(`ERROR - cannot ${action} ${type} ${element}. ${element} does not exist.`))
    process.exit(1)
  }
}
