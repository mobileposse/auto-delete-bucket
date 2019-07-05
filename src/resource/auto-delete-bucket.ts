import { Code, Runtime, SingletonFunction } from '@aws-cdk/aws-lambda'
import { Construct, RemovalPolicy, Duration } from '@aws-cdk/core'
import {
  CustomResource,
  CustomResourceProvider
} from '@aws-cdk/aws-cloudformation'
import { Bucket, BucketProps } from '@aws-cdk/aws-s3'
import path = require('path')

export class AutoDeleteBucket extends Bucket {
  constructor(scope: Construct, id: string, props: BucketProps = {}) {
    super(scope, id, {
      ...props,
      removalPolicy: RemovalPolicy.DESTROY
    })

    const lambda = new SingletonFunction(this, 'AutoBucketHandler', {
      uuid: '7677dc81-117d-41c0-b75b-db11cb84bb70',
      runtime: Runtime.NODEJS_10_X,
      code: Code.asset(path.join(__dirname, '../lambda')),
      handler: 'main.handler',
      lambdaPurpose: 'AutoBucket',
      timeout: Duration.minutes(15)
    })

    const provider = CustomResourceProvider.lambda(lambda)

    // allow the bucket contents to be read and deleted by the lambda
    this.grantReadWrite(lambda)

    new CustomResource(this, 'AutoBucket', {
      provider,
      resourceType: 'Custom::AutoDeleteBucket',
      properties: {
        bucketName: this.bucketName
      }
    })
  }
}
