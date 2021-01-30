import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";
import * as kubernetes from "@pulumi/kubernetes";

const infraStack = new pulumi.StackReference("rkotcher/infra/global");

const kubeconfig = infraStack.getOutput('kubeconfig');

const provider = new kubernetes.Provider("do-k8s-provider", { kubeconfig })

// Create the deployment
const appLabels = { "app": "personal-site" };

const app = new kubernetes.apps.v1.Deployment("personal-site-app-dep", {
    spec: {
        selector: { matchLabels: appLabels },
        replicas: 3,
        template: {
            metadata: { labels: appLabels },
            spec: {
                containers: [{
                    name: "personal-site",
                    image: "wheresmycookie/personal-site",
                }],
            },
        },
    },
}, { provider });
