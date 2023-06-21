import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import {
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  Port,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  PostgresEngineVersion,
} from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";

interface RDSStackProps extends StackProps {
  vpc: Vpc;
  jumpboxInstance: Instance;
}

export class RDSStack extends Stack {
  public readonly dbInstance: DatabaseInstance;
  constructor(scope: Construct, id: string, props?: RDSStackProps) {
    super(scope, id, props);

    if (!props?.vpc) {
      throw new Error("Provide a VPC");
    }

    this.dbInstance = new DatabaseInstance(this, "rdsTryOutDbPrimaryInstance", {
      vpc: props.vpc,
      vpcSubnets: {
        subnetGroupName: "rdsTryOutDbInstance",
      },
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_15_3,
      }),
      instanceType: InstanceType.of(
        InstanceClass.BURSTABLE3,
        InstanceSize.MICRO
      ),
      credentials: Credentials.fromGeneratedSecret("postgres"),
      multiAz: true,
      allocatedStorage: 20,
      maxAllocatedStorage: 30,
      allowMajorVersionUpgrade: false,
      backupRetention: Duration.hours(24),
      deleteAutomatedBackups: true,
      deletionProtection: false,
      databaseName: "rdsTryOutDb",
      publiclyAccessible: false,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.dbInstance.connections.allowFrom(
      props.jumpboxInstance,
      Port.tcp(5432)
    );

    new CfnOutput(this, "dbEndpoint", {
      value: this.dbInstance.instanceEndpoint.hostname,
    });

    new CfnOutput(this, "secretName", {
      value: this.dbInstance.secret?.secretName!,
    });
  }
}
