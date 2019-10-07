import program from 'commander'
import chalk from 'chalk'
import yaml from 'js-yaml'
import fs from 'fs-extra'
import lockers from './lockers'

const log = console.log;

program.version('0.0.1')
program.command('pull')
  .description('Pull down dependecies from your lockers')
  .action(() => {
    const doc = getDoc()
    lockers.local.pull(doc)
    lockers.s3.pull(doc)
  })
program.command('push')
  .description('Push up local changes to your lockers')
  .action(() => {
    const doc = getDoc()
    lockers.local.push(doc)
    lockers.s3.push(doc)
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

export function cli(args) {
  program.parse(args)
}
