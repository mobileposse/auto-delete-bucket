import axios from 'axios'

/**
 * See the AWS documentation for more information on what needs to be contained in the
 * response of a custom resource.
 *
 * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-responses.html
 */
export const sendResponse = async props => {
  const body = {
    Status: props.status,
    Reason: props.reason,
    PhysicalResourceId: props.physicalResourceId,
    StackId: props.stackId,
    RequestId: props.requestId,
    LogicalResourceId: props.logicalResourceId
  }

  const responseBody = JSON.stringify(body)
  console.log({ responseBody })

  await axios.put(props.responseUrl, responseBody, {
    data: responseBody,
    headers: { 'content-type': '', 'content-length': responseBody.length }
  })
}
