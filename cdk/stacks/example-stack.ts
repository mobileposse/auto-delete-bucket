import { App, Stack, StackProps } from '@aws-cdk/cdk'
import { AutoBucket } from '../../src/resource/autobucket'

export class ExampleStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    new AutoBucket(this, 'example-autobucket-1', {
      bucketName: 'autoexample-bucket1'
    })

    new AutoBucket(this, 'example-autobucket-2', {
      bucketName: 'autoexample-bucket2'
    })
  }
}
