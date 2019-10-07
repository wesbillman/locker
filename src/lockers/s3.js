import chalk from 'chalk'
import aws from 'aws-sdk'
import fs from 'fs-extra'
import mime from 'mime'
import path from 'path'

const log = console.log;
const s3 = new aws.S3()
const DefaultMimeType = 'application/octet-stream';

async function push(doc) {
  const bucket = doc.lockers.s3
  if (!bucket) {
    return
  }

  log(`Putting gear in your ${chalk.magenta('s3')} locker`)
  log(chalk.gray(bucket))
  verify3Access(bucket)
  const basePath = getBasePath(doc)
  log(basePath)

  for (const directory of doc.gear.directories) {
    log(`Pushing dir  - ${chalk.magenta(directory)}...`)
    await uploadToS3(directory, `${basePath}/${directory}`, bucket)
    log(`${chalk.magenta(directory)} ${chalk.green('✓')}`)
  }

  for (const file of doc.gear.files) {
    log(`Pushing file  - ${chalk.magenta(file)}...`)
    await uploadToS3(file, `${basePath}/${file}`, bucket)
    log(`${chalk.magenta(file)} ${chalk.green('✓')}`)
  }
}

function pull(doc) {
  const bucket = doc.lockers.s3
  if (!bucket) {
    return
  }
  log(`Getting gear out of your ${chalk.magenta('s3')} locker`)
  log(chalk.gray(bucket))
  verify3Access(bucket)

  doc.gear.directories.forEach(element => {
    process.stdout.write(`Pulling dir  - ${chalk.magenta(element)}...`)
    log(chalk.green('✓'))
  });

  doc.gear.files.forEach(element => {
    process.stdout.write(`Pulling file - ${chalk.magenta(element)}...`)
    log(chalk.green('✓'))
  });
}

async function verify3Access(bucket) {
  await s3.listObjects({Bucket: bucket}).promise()
}

function getBasePath(doc) {
  return `locker/${doc.team}`
}

async function uploadToS3(filePath, remotePath, bucket) {
  const stats = fs.lstatSync(filePath)

  if (stats.isDirectory()) {
    return uploadDirToS3(filePath, remotePath, bucket)
  } else if (stats.isFile()) {
    let contentType = mime.getType(filePath, DefaultMimeType)

    const uploadParams = {
      Body: fs.readFileSync(filePath),
      Key: remotePath,
      Bucket: bucket,
      ContentType: contentType,
    };


    await s3.putObject(uploadParams).promise()
    log(`${chalk.green('✓')} ${chalk.gray(remotePath)}`)
    return Promise.resolve()
  }

  return Promise.resolve()
}

function uploadDirToS3(dir, remotePath, bucket) {
  return Promise.all(fs.readdirSync(dir).map((fileName) => {
    const filePath = path.join(dir, fileName)
    const s3Path = path.join(remotePath, fileName)

    return uploadToS3(filePath, s3Path, bucket)
  }))
}

export default {pull, push}
