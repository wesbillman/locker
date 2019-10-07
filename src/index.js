import program from 'commander'
import chalk from 'chalk'
import yaml from 'js-yaml'
import fs from 'fs'
import os from 'os'

const log = console.log;

program
  .option('-f, --file <path>', 'Lockerfile path')


function local(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path)
    log(chalk.green(`${path} created for local storage`))
  }
}

export function cli(args) {
  program.parse(args)

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
    doc = yaml.safeLoad(fs.readFileSync(lockerfile, 'utf8'));
  } catch (e) {
    log(e);
  }

  if (doc.rooms.local) {
    const localPath = doc.rooms.local.replace(/^~/, os.homedir());
    local(localPath);
  }
}
