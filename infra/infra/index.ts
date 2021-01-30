import * as digitalocean from "@pulumi/digitalocean";
import * as kubernetes from "@pulumi/kubernetes";

const cluster = new digitalocean.KubernetesCluster("do-cluster", {
    region: digitalocean.Regions.SFO2,
    version: "latest",
    nodePool: {
        name: "default-pool",
        size: digitalocean.DropletSlugs.DropletS1VCPU2GB,
        nodeCount: 2,
    },
});

export const kubeconfig = cluster.kubeConfigs[0].rawConfig;
