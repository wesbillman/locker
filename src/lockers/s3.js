import chalk from 'chalk'
import aws from 'aws-sdk'
import execa from 'execa'
import compression from '../utils/compression'
import os from 'os'
import uuidv5 from 'uuid/v5'
import trash from 'trash'

const log = console.log
const s3 = new aws.S3()

async function push(doc, force) {
  const bucket = doc.lockers.s3
  if (!bucket) {
    return
  }

  verify3Access(bucket)
  const basePath = getBasePath(doc)

  const exists = await objectExists(bucket, basePath)
  if(exists && !force) {
    log(chalk.red(`Locker already exist at: ${bucket}/${basePath}`))
    log('Use "locker push -f" to overwrite')
    process.exit(1)
  }

  log(`Putting gear in your ${chalk.magenta('s3')} locker`)
  log(chalk.gray(bucket))

  for (const source of getAllGear(doc)) {
    process.stdout.write(`Compressing - ${chalk.magenta(source.path)}...`)
    const result = await compression.zip(source.path);
    log(chalk.green('✓'))

    log(`Pushing - ${chalk.magenta(source.path)}...`)
    const s3Path = `${bucket}/${basePath}/${source.path}.zip`

    const { stderr } = await execa('aws', ['s3', 'cp', result, `s3://${s3Path}`], {stdio: 'inherit'});
    if (stderr) {
      log(chalk.red(`ERROR - Failed to push ${source.path}`))
      process.exit(1)
    }
  }
  log(`${chalk.green('✓')} Push Successful ${chalk.green('✓')}`)
}

async function pull(doc) {
  const bucket = doc.lockers.s3
  if (!bucket) {
    return
  }
  log(`Getting gear out of your ${chalk.magenta('s3')} locker`)
  log(chalk.gray(bucket))
  verify3Access(bucket)

  const basePath = getBasePath(doc)

  for (const path of getAllGear(doc)) {
    log(`Pulling - ${chalk.magenta(path.path)}...`)

    const s3Path = `${bucket}/${basePath}/${path.path}`

    const filename = uuidv5(path.path, uuidv5.URL)
    const downloadPath = `${os.tmpdir()}/${filename}.zip`
    const args = ['s3', 'cp', `s3://${s3Path}.zip`, downloadPath]
    const { stderr } = await execa('aws', args, {stdio: 'inherit'});
    if (stderr) {
      log(chalk.red(`ERROR - Failed to push ${path.path}`))
      process.exit(1)
    }

    process.stdout.write(`Uncompressing - ${chalk.magenta(path.path)}...`)
    await trash(path.path)
    await compression.unzip(downloadPath)
    log(chalk.green('✓'))
  }

  log(`${chalk.green('✓')} Pull Successful ${chalk.green('✓')}`)
}

async function verify3Access(bucket) {
  await s3.listObjectsV2({Bucket: bucket}).promise()
}

async function objectExists(bucket, key) {
  const result = await s3.listObjectsV2({Bucket: bucket, Prefix: key}).promise()
  return result.Contents.length > 0
}

function getBasePath(doc) {
  return `locker/${doc.version}`
}

function getAllGear(doc) {
  let folders = []
  if (doc.gear.folders) {
    folders = doc.gear.folders.map((element) => {
      return {path: element, isFolder: true}
    }) || []
  }

  let files = []
  if (doc.gear.files) {
    files = doc.gear.files.map((element) => {
      return {path: `${element}`, isFolder: false}
    }) || []
  }

  return folders.concat(files)
}

export default {pull, push}
