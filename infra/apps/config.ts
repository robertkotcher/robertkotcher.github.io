import * as pulumi from "@pulumi/pulumi";
import * as k8s from '@pulumi/kubernetes';

// Construct the provider in config.ts to pass to index file
const clusterStackRef = new pulumi.StackReference(`rkotcher/infra/global`);

const kubeconfig = clusterStackRef.getOutput('kubeconfig');
const provider = new k8s.Provider('do-k8s-provider', { kubeconfig })

export const config = { provider };

