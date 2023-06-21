import { Stack, StackProps } from "aws-cdk-lib";
import {
  AmazonLinuxGeneration,
  AmazonLinuxImage,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  SecurityGroup,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

interface EC2StackProps extends StackProps {
  vpc: Vpc;
  securityGroup: SecurityGroup;
}

export class EC2Stack extends Stack {
  public readonly ec2: Instance;
  constructor(scope: Construct, id: string, props?: EC2StackProps) {
    super(scope, id, props);

    if (!props?.vpc) {
      throw new Error("Provide a VPC");
    }

    this.ec2 = new Instance(this, "rdsTryOutJumpbox", {
      vpc: props?.vpc,
      vpcSubnets: {
        subnetGroupName: "rdsTryOutVpcPublicSubnet",
      },
      securityGroup: props.securityGroup,
      instanceName: "rdsTryOutJumpbox",
      instanceType: InstanceType.of(
        InstanceClass.BURSTABLE3,
        InstanceSize.MICRO
      ),
      machineImage: new AmazonLinuxImage({
        generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: "sls-rds-dr-key",
    });
  }
}
