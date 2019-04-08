import { handler } from '../../src/lambda/index'
import * as fx from 'node-fixtures'

// mock the send response stuff ... we're not actually going to communicate with
// AWS cloudformatino process during these tests
jest.mock('../../src/lambda/send-response', () => ({
  sendResponse: jest.fn()
}))

// mock the s3 stuff so we don't actually attempt to delete any buckets
jest.mock('../../src/lambda/empty-bucket', () => ({
  emptyBucket: jest.fn()
}))

const { sendResponse } = require('../../src/lambda/send-response')
const { emptyBucket } = require('../../src/lambda/empty-bucket')

describe('#handler', () => {
  beforeEach(async () => {
    sendResponse.mockReset()
    emptyBucket.mockReset()
  })

  describe('when request type is Create but no bucketName is specified', () => {
    beforeEach(async () => {
      await handler(fx.create_no_bucket)
    })

    it('should send a response with a status of FAILED', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'FAILED' })
      )
    })

    it('should include missing bucket name in the reason', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ reason: 'bucketName is required' })
      )
    })
  })

  describe('when request type is Update but no bucketName is specified', () => {
    beforeEach(async () => {
      await handler(fx.update_no_bucket)
    })

    it('should send a response with a status of FAILED', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'FAILED' })
      )
    })

    it('should include missing bucket name in the reason', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ reason: 'bucketName is required' })
      )
    })
  })

  describe('when request type is Delete but no bucketName is specified', () => {
    beforeEach(async () => {
      await handler(fx.delete_no_bucket)
    })

    it('should send a response with a status of FAILED', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'FAILED' })
      )
    })

    it('should include missing bucket name in the reason', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ reason: 'bucketName is required' })
      )
    })

    test.toString('should not attempt any S3 operations')
  })

  describe('when request type is Create', () => {
    beforeEach(async () => {
      await handler(fx.create)
    })

    it('should rsend a response with a status of SUCCESS', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'SUCCESS' })
      )
    })

    it('should send a response with a generated physical resource id', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ physicalResourceId: expect.any(String) })
      )
    })

    it('should rsend a response with the same StackId as provided in the request', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ stackId: fx.create.StackId })
      )
    })

    it('should send a response with the same RequestId as provided in the request', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ requestId: fx.create.RequestId })
      )
    })

    it('should send a response with the same LogicalResourceId as provided in the request', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          logicalResourceId: fx.create.LogicalResourceId
        })
      )
    })
  })

  describe('with two different Create requests', () => {
    beforeEach(async () => {
      await handler(fx.create)
      await handler(fx.create2)
    })

    it('should send a response with a unique PhysicalResourceId for each request', () => {
      // NOTE: fn.mock.calls[0][0] — the first argument of the first call
      expect(sendResponse.mock.calls[0][0]['physicalResourceId']).not.toEqual(
        sendResponse.mock.calls[1][0]['physicalResourceId']
      )
    })
  })

  describe('when a resource with the same LogicalResourceId is Created and then Updated', () => {
    beforeEach(async () => {
      await handler(fx.create)
      await handler(fx.update)
    })

    it('should send a response with the same PhysicalResourceId for each request', () => {
      // NOTE: fn.mock.calls[0][0] — the first argument of the first call
      expect(sendResponse.mock.calls[0][0]['physicalResourceId']).toEqual(
        sendResponse.mock.calls[1][0]['physicalResourceId']
      )
    })
  })

  describe('when a resource with the same LogicalResourceId is Created and then Deleted', () => {
    beforeEach(async () => {
      await handler(fx.create)
      await handler(fx.delete)
    })

    it('should send a response with the same PhysicalResourceId for each request', () => {
      // NOTE: fn.mock.calls[0][0] — the first argument of the first call
      expect(sendResponse.mock.calls[0][0]['physicalResourceId']).toEqual(
        sendResponse.mock.calls[1][0]['physicalResourceId']
      )
    })
  })

  describe('when request type is Update', () => {
    beforeEach(async () => {
      await handler(fx.update)
    })

    it('should return a SUCCESS response', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'SUCCESS' })
      )
    })

    it('should send a response with a generated physical resource id', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ physicalResourceId: expect.any(String) })
      )
    })

    it('should rsend a response with the same StackId as provided in the request', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ stackId: fx.update.StackId })
      )
    })

    it('should send a response with the same RequestId as provided in the request', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ requestId: fx.update.RequestId })
      )
    })

    it('should send a response with the same LogicalResourceId as provided in the request', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          logicalResourceId: fx.update.LogicalResourceId
        })
      )
    })
  })

  describe('when request type is Delete and the bucket exists', () => {
    beforeEach(async () => {
      await handler(fx.delete)
    })

    it('should return a SUCCESS response', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'SUCCESS' })
      )
    })

    it('should send a response with a generated physical resource id', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ physicalResourceId: expect.any(String) })
      )
    })

    it('should rsend a response with the same StackId as provided in the request', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ stackId: fx.delete.StackId })
      )
    })

    it('should send a response with the same LogicalResourceId as provided in the request', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          logicalResourceId: fx.delete.LogicalResourceId
        })
      )
    })

    it('should send a response with the same RequestId as provided in the request', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ requestId: fx.delete.RequestId })
      )
    })

    it('should empty the bucket', () => {
      expect(emptyBucket).toHaveBeenCalled()
    })
  })

  describe('when request type is Delete and S3 raises an error message', () => {
    beforeEach(async () => {
      emptyBucket.mockImplementation(() => {
        throw new Error('Some Reason')
      })
      await handler(fx.delete)
    })

    it('should send a response with a status of FAILED', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'FAILED' })
      )
    })

    it('should include the S3 error message in the reason', () => {
      expect(sendResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: expect.stringContaining('Some Reason')
        })
      )
    })
  })
})
