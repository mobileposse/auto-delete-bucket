import { sendResponse } from './send-response'
import { emptyBucket } from './empty-bucket'

export const handler = async event => {
  console.log(JSON.stringify(event, null, 2))

  /**
   * See the AWS documentation for more information passed in the request for a custom resource.
   *
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html
   */
  const bucketName = event.ResourceProperties.BucketName

  let status = 'SUCCESS'
  let reason = ''

  if (!bucketName) {
    status = 'FAILED'
    reason = 'bucketName is required'
  }

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    // Nothing to do here - create and update should always succeed
  } else if (status === 'SUCCESS') {
    try {
      await emptyBucket(bucketName)
    } catch (err) {
      reason = `Unable to empty bucket contents for: ${bucketName} - ${err}`
      status = 'FAILED'
    }
  }

  await sendResponse({
    status: status,
    requestId: event.RequestId,
    stackId: event.StackId,
    reason: reason,
    logicalResourceId: event.LogicalResourceId,
    physicalResourceId: `${bucketName}-${event.LogicalResourceId}`,
    responseUrl: event.ResponseURL
  })
}
