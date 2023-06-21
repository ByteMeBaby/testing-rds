#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { VPCStack } from "../lib/vpcStack";
import { EC2Stack } from "../lib/ec2Stack";
import { RDSStack } from "../lib/rdsStack";

const app = new cdk.App();

const vpc = new VPCStack(app, "VPCStack", {
  env: {
    region: "us-east-1",
  },
});

const ec2 = new EC2Stack(app, "EC2Stack", {
  env: {
    region: "us-east-1",
  },
  securityGroup: vpc.rdsSecurityGroup,
  vpc: vpc.vpc,
});

new RDSStack(app, "RDSStack", {
  env: {
    region: "us-east-1",
  },
  vpc: vpc.vpc,
  jumpboxInstance: ec2.ec2,
});

// new RdsTryOutStack(app, 'RdsTryOutStack', {
//   /* If you don't specify 'env', this stack will be environment-agnostic.
//    * Account/Region-dependent features and context lookups will not work,
//    * but a single synthesized template can be deployed anywhere. */

//   /* Uncomment the next line to specialize this stack for the AWS Account
//    * and Region that are implied by the current CLI configuration. */
//   // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

//   /* Uncomment the next line if you know exactly what Account and Region you
//    * want to deploy the stack to. */
//   // env: { account: '123456789012', region: 'us-east-1' },

//   /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
// });
