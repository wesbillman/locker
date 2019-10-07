import chalk from 'chalk'
const log = console.log;

function push(doc) {
  log(chalk.blue(`Putting gear in your ${chalk.white('s3')} locker`))

  doc.gear.directories.forEach(element => {
    process.stdout.write(`putting ${chalk.green(element)} in your locker...`)
    log('✅')
  });

  doc.gear.files.forEach(element => {
    process.stdout.write(`putting ${chalk.green(element)} in your locker...`)
    log('✅')
  });
}

function pull(doc) {
  log(chalk.blue(`Getting gear out of your ${chalk.white('s3')} locker`))

  doc.gear.directories.forEach(element => {
    log(`dir  - ${chalk.green(element)}`)
  });

  doc.gear.files.forEach(element => {
    log(`file - ${chalk.green(element)}`)
  });
}

export default {pull, push}
