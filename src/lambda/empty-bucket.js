import * as AWS from 'aws-sdk'

const s3 = new AWS.S3()

export const emptyBucket = async bucketName => {
  // delete bucket contents
  const listedObjects = await s3
    .listObjectVersions({ Bucket: bucketName })
    .promise()

  // nothing left - we're done!
  const contents = (listedObjects.Versions || []).concat(
    listedObjects.DeleteMarkers || []
  )
  if (contents.length === 0) return

  let records = []

  // make a list of objects to delete
  for (let record of contents) {
    records.push({ Key: record.Key, VersionId: record.VersionId })
  }

  await s3
    .deleteObjects({ Bucket: bucketName, Delete: { Objects: records } })
    .promise()

  // repeat as necessary
  if (listedObjects.IsTruncated) await emptyBucket(bucketName)
}
