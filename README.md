## What it does

Creates an S3 bucket in Cloud Formation that will automatically be emptied **before** the bucket is destroyed by Cloud Formation.

## How to use it

This is an [AWS CDK Construct](https://docs.aws.amazon.com/CDK/latest/userguide/constructs.html) which makes it dead simple to use in your CDK code.

Just install with npm:

```
npm add @mobileposse/auto-delete-bucket
```

or yarn:

```
yarn add @mobileposse/auto-delete-bucket
```

And then require the construct and use it in your stack like any standard CDK resource!

```js
import { AutoDeleteBucket } from '@mobileposse/auto-delete-bucket'

export class ExampleStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    /**
     * NOTE: S3 requires bucket names to be globally unique across accounts so
     * you will need to change the bucketName to something that nobody else is
     * using.
     */
    new AutoDeleteBucket(this, 'example-autobucket-1', {
      bucketName: 'autoexample-bucket1'
    })
  }
}
```

See the example directory for a complete CDK example. Be sure to change the `bucketNames` so they are unique.

The bucket can be configured with any of the [standard CDK Bucket Properties](https://awslabs.github.io/aws-cdk/refs/_aws-cdk_aws-s3.html#bucketprops-interface).

## Requirements

- This is designed to work with AWS CDK but feel free to borrow the code if you want to create the custom CF resource some other way.
- Does not yet work with versioned buckets but it can be easily adapted to do so (pull requests welcome.)

## Versioning

Version numbers are consistent with the major and minor version numbers of the corresponding AWS CDK version that this module is compatible with. In other words, version 1.1.X would be compatiable with aws-cdk 1.1.X. Patch versions will inevitably vary between the two project but as long as you are using a version consistent with the major and minor version of the CDK version you are using you should be good.

## Motivation

Cloud Formation will often fail to actually delete your S3 Bucket resources when you destroy your stack. This happens whenever the bucket is not empty as the Cloud Formation documentation clearly states:

> You can only delete empty buckets. Deletion fails for buckets that have contents.

We find that in most of our use cases, we want to automatically delete the bucket and it's contents whenever the stack is deleted. Otherwise you will have a bunch of orphaned buckets to clean up manualy. The problem is even worse when you need to explicitly name the bucket (ex. for a website), because you won't be able to recreate the stack due to the fact that a bucket already exists with that name.

## How it Works

Create a [custom resource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html) that will automatically delete your bucket contents before attempting bucket deletion.

## Running Tests

```
yarn test
```

## Building the Example Stack

The source code includes a reference CDK project inside the `example` directory which consists of a single `auto-delete-bucket`.

You can build the stack with:

```
yarn cdk:deploy
```

Go ahead and test this bucket out by adding some files to it. You can then test that everything will delete properly by destroying the stack (and bucket) with:

```
yarn cdk:destroy
```

## Publish to NPM (Official maintainers only)

Add npm user to your local machine (one time setup)

```
npm adduser
```

Push the release (you will be asked the new version)

```
npm login
```

Then provide username and password. Once authenticaated use the following command:

```
npm publish --access public
```

Push the tagged source back up to Github

```
git push --tags
```

## More Information

See the [AWS documentation](https://docs.aws.amazon.com/AmazonS3/latest/dev/delete-or-empty-bucket.html) for more information on S3 and deleting bucket contents.
