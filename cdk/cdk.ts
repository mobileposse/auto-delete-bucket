#!/usr/bin/env node
import { App } from '@aws-cdk/cdk'
import { ExampleStack } from './stacks/example-stack'

const cdk = new App()
new ExampleStack(cdk, 'auto-bucket-example', {})

cdk.run()
