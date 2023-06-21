import { Stack, StackProps } from "aws-cdk-lib";
import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

interface VPCStackProps extends StackProps {}

export class VPCStack extends Stack {
  public readonly vpc: Vpc;
  constructor(scope: Construct, id: string, props?: VPCStackProps) {
    super(scope, id, props);

    this.vpc = new Vpc(this, "rdsTryOutVpc", {
      vpcName: "rdsTryOutVpc",
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 20,
          name: "rdsTryOutVpcPublicSubnet",
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 20,
          name: "rdsTryOutDbInstance",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 20,
          name: "rdsTryOutReadReplica",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 20,
          name: "rdsStandBy",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 20,
          name: "futureUse",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
      maxAzs: 3,
    });
  }
}
