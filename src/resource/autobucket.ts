import { Code, Runtime, SingletonFunction } from '@aws-cdk/aws-lambda'
import { Construct, RemovalPolicy } from '@aws-cdk/cdk'
import { CustomResource } from '@aws-cdk/aws-cloudformation'
import { Bucket, BucketProps } from '@aws-cdk/aws-s3'

interface AutoProps extends BucketProps {
  bucketName: string
  removalPolicy?: RemovalPolicy
}

export class AutoBucket extends Construct {
  constructor(scope: Construct, id: string, props: AutoProps) {
    super(scope, id)

    const bucketName = props.bucketName

    // make sure the bucket is deleted when stack tells us to delete
    props.removalPolicy = RemovalPolicy.Destroy

    const lambdaProvider = new SingletonFunction(this, 'AutoBucketHandler', {
      uuid: '7677dc81-117d-41c0-b75b-db11cb84bb70',
      runtime: Runtime.NodeJS810,
      code: Code.asset('./dist/src/lambda'),
      handler: 'main.handler'
    })

    const bucket = new Bucket(scope, bucketName, props)

    // allow the bucket contents to be read and deleted by the lambda
    bucket.grantReadWrite(lambdaProvider.role)

    const custom = new CustomResource(this, 'AutoBucket', {
      lambdaProvider,
      resourceType: 'Custom::AutoBucket',
      properties: {
        bucketName: bucketName
      }
    })

    /**
     * Add bucket as a dependency of the custom resource in order to ensure that the
     * custom resource will be destroyed first which then give it a chance to clear
     * out the bucket before the bucket is deleted (and that is the whole point.)
     */
    custom.node.addDependency(bucket)
  }
}
