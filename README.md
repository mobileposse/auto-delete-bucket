## The Problem

Cloud Formation will often fail to actually delete your S3 Bucket resources when you destroy your stack. This happens whenever the bucket is not empty as the Cloud Formation documentation clearly states:

> You can only delete empty buckets. Deletion fails for buckets that have contents.

We find that in most of our use cases, we want to automatically delete the bucket and it's contents whenever the stack is deleted. Otherwise you will have a bunch of orphaned buckets to clean up manualy. The problem is even worse when you need to explicitly name the bucket (ex. for a website), because you won't be able to recreate the stack due to the fact that a bucket already exists with that name.

## The Solution

Create a [custom resource](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html) that will automatically delete your bucket contents before attempting bucket deletion.