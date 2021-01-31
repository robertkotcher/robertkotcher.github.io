import * as k8s from '@pulumi/kubernetes';
import * as pulumi from '@pulumi/pulumi';

import { config } from './config';

const name = 'nginx-ingress';

const namespace = new k8s.core.v1.Namespace(`${name}-namespace`,
	{
		metadata: {
			name: 'nginx-ingress',
		}
	},
	{ provider: config.provider }
);

const lbHostname = 'workaround.robertkotcher.me';

const lbAnnotations = {
	'service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol': 'true',
	'service.beta.kubernetes.io/do-loadbalancer-hostname': lbHostname,
};

// enable pod-pod communication through the LB
// https://github.com/kubernetes/kubernetes/issues/66607
function applyHostnameToLB(obj: any, opts: pulumi.CustomResourceOptions) {
	if (obj.kind === 'Service' && obj.metadata.name === 'ingress-nginx-controller') {
		obj.metadata['annotations'] = lbAnnotations;
	}
}

const chart = new k8s.helm.v3.Chart(`${name}-chart`, {
	chart: 'nginx-ingress',
	namespace: namespace.metadata.name,
	version: '1.41.3',
	fetchOpts:{
		repo: 'https://charts.helm.sh/stable',
  },
	transformations: [
		applyHostnameToLB
	],
});
