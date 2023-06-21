import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { SecurityGroup, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { SubnetGroup } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";

interface VPCStackProps extends StackProps {}

export class VPCStack extends Stack {
  public readonly vpc: Vpc;
  public readonly rdsSecurityGroup: SecurityGroup;
  public readonly rdsPrimarySubnetGroup: SubnetGroup;

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
      availabilityZones: ["us-east-1a", "us-east-1b", "us-east-1c"],
      // maxAzs: 3
      // Here we can not use maxAzs and AvailabilityZones together
    });

    this.vpc.applyRemovalPolicy(RemovalPolicy.DESTROY);

    this.rdsPrimarySubnetGroup = new SubnetGroup(
      this,
      "rdsPrimaryInstanceSubnetGroup",
      {
        description: "rdsPrimaryInstanceSubnetGroup",
        subnetGroupName: "rdsPrimaryInstanceSubnetGroup",
        vpc: this.vpc,
        vpcSubnets: {
          subnetGroupName: "rdsTryOutDbInstance",
        },
      }
    );

    this.rdsSecurityGroup = new SecurityGroup(this, "rdsSecurityGroup", {
      vpc: this.vpc,
      securityGroupName: "rdsSecurityGroup",
    });
  }
}
