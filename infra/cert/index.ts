import * as digitalocean from "@pulumi/digitalocean";
import * as k8s from '@pulumi/kubernetes';

import { ClusterIssuer } from "@brpaz/pulumi-k8s-resources";

import { config } from './config';

const name = 'cert-manager';

const namespace = new k8s.core.v1.Namespace(`${name}-namespace`,
	{
		metadata: {
			name
		}
	},
	{ provider: config.provider }
);

const chart = new k8s.helm.v3.Chart(`${name}-chart`, {
	chart: 'cert-manager',
	namespace: namespace.metadata.name,
	version: 'v1.1.0',
	fetchOpts:{
		repo: 'https://charts.jetstack.io',
  },
});
