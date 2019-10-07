import program from 'commander'
import chalk from 'chalk'
import yaml from 'js-yaml'
import fs from 'fs-extra'
import os from 'os'

const log = console.log;

program.version('0.0.1')
program.command('pull')
  .description('Pull down dependecies from your lockers')
  .action(() => {
    localPull(getDoc())
  })
program.command('push')
  .description('Push up local changes to your lockers')
  .action(() => {
    localPush(getDoc())
  })
program.option('-f, --file <path>', 'Lockerfile path')
program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
})

function validate(doc) {
  if (!doc.team) {
    log(chalk.red('Lockerfile must specify a "team"'))
    process.exit(1)
  }

  if (!doc.lockers) {
    log(chalk.red('Lockerfile must specify at least one "locker"'))
    process.exit(1)
  }

  if (!doc.gear) {
    log(chalk.red('Lockerfile must specify "gear"'))
    process.exit(1)
  }
}

function localPull(doc) {
  log(chalk.blue('Getting gear out of your locker'))
  let localPath = getLocalPath(doc)
  if (!localPath) {
    return
  }

  doc.gear.directories.forEach(element => {
    log(`dir  - ${chalk.green(element)}`)
  });

  doc.gear.files.forEach(element => {
    log(`file - ${chalk.green(element)}`)
  });
}

function localPush(doc) {
  log(chalk.blue('Putting gear in your locker'))
  let localPath = getLocalPath(doc)
  if (!localPath) {
    return
  }

  doc.gear.directories.forEach(element => {
    process.stdout.write(`putting ${chalk.green(element)} in your locker...`)
    fs.copySync(element, `${localPath}/${element}`)
    log('✅')
  });

  doc.gear.files.forEach(element => {
    process.stdout.write(`putting ${chalk.green(element)} in your locker...`)
    fs.copySync(element, `${localPath}/${element}`)
    log('✅')
  });
}

function getDoc() {
  let lockerfile = 'Lockerfile'
  if (program.file) {
    lockerfile = program.file
  }

  if (!fs.existsSync(lockerfile)) {
    log(chalk.red(`Lockerfile not found at ${lockerfile}`))
    process.exit(1)
  }

  let doc
  try {
    return yaml.safeLoad(fs.readFileSync(lockerfile, 'utf8'));
  } catch (e) {
    log(e);
  }

  validate(doc)
}

function getLocalPath(doc) {
  let localPath = doc.lockers.local.replace(/^~/, os.homedir());
  localPath = `${localPath}/${doc.team}`
  if (!fs.existsSync(localPath)) {
    fs.mkdirSync(localPath)
    log(chalk.green(`${localPath} created for local storage`))
  }
  return localPath
}

export function cli(args) {
  program.parse(args)
}
