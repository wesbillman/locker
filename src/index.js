import program from 'commander'
import chalk from 'chalk'
import yaml from 'js-yaml'
import fs from 'fs-extra'
import lockers from './lockers'

const log = console.log;

program.version('0.0.1')
program.command('init')
  .description('Setup project for locker')
  .action(() => {
    createLockerFile()
  })
program.command('pull')
  .description('Pull down dependecies from your lockers')
  .action(() => {
    const doc = getDoc()
    lockers.local.pull(doc)
    lockers.s3.pull(doc)
  })
program.command('push')
  .description('Push up local changes to your lockers')
  .option('-f, --force', 'force push a new version even if the version already exists in your locker', false)
  .action((cmd) => {
    const doc = getDoc()
    lockers.local.push(doc, cmd.force)
    lockers.s3.push(doc, cmd.force)
  })
program.option('-p, --path <filepath>', 'Lockerfile path')
program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
})

function validate(doc) {
  if (!doc.version) {
    log(chalk.red('Lockerfile must specify a "version"'))
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

function createLockerFile() {
  const filename = 'Lockerfile'
  if (fs.existsSync(filename)) {
    log(chalk.red('Lockerfile already exists.'))
    process.exit(1)
  }

  const content = `# unique id for this bundle
version: 1

# locations to store the bundles
lockers:
  s3: example-bucket-name

# specify the directories and files you'd like to store
gear:
  folders:
    - Examples
  files:
    - example.txt
  `

  fs.writeFile(filename, content, function(err) {
    if(err) {
      log(chalk.red(err))
      process.exit(1)
      return
    }

    log(`${chalk.green('✓')} Lockerfile created!`);
  });
}

export function cli(args) {
  program.parse(args)
}
