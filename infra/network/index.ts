import * as pulumi from "@pulumi/pulumi";
import * as digitalocean from "@pulumi/digitalocean";
import * as kubernetes from "@pulumi/kubernetes";

const infraStack = new pulumi.StackReference("rkotcher/infra/global");
const certStack = new pulumi.StackReference("rkotcher/cert/global")

const kubeconfig = infraStack.getOutput('kubeconfig');
const certId = certStack.getOutput('certId');

const provider = new kubernetes.Provider("do-k8s-provider", { kubeconfig })

// Present the deployment through a service
const appService = new kubernetes.core.v1.Service("personal-site-app-svc", {
    metadata: {
        annotations: {
            'service.beta.kubernetes.io/do-loadbalancer-protocol': 'http',
            'service.beta.kubernetes.io/do-loadbalancer-algorithm': 'round_robin',
            'service.beta.kubernetes.io/do-loadbalancer-tls-ports': '443',
            'service.beta.kubernetes.io/do-loadbalancer-certificate-id': "robertkotcher-me-cert-e57e322",
            'service.beta.kubernetes.io/do-loadbalancer-redirect-http-to-https': "true",
        }
    },
    spec: {
        type: "LoadBalancer",
        selector: { "app": "personal-site" },
        ports: [
            {
                name: 'http',
                protocol: 'TCP',
                port: 80,
                targetPort: 80,
            },
            {
                name: 'https',
                protocol: 'TCP',
                port: 443,
                targetPort: 80,
            }
        ],
    },
}, { provider });

export const ingressIp = appService.status.loadBalancer.ingress[0].ip;

const cnameRecord = new digitalocean.DnsRecord("kotcherrobert-cname-record", {
    domain: 'robertkotcher.me',
    type: "CNAME",
    name: "www",
    value: "@",
});

const aRecord = new digitalocean.DnsRecord("kotcherrobert-a-record", {
    name: '@',
    domain: 'robertkotcher.me',
    type: "A",
    value: ingressIp,
});
