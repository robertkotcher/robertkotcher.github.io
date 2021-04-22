import * as types from './types';
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

import { config } from './config';
import { rootPulumiStackTypeName } from '@pulumi/pulumi/runtime';
import { Output } from '@pulumi/pulumi';

// apps defines the different apps deployed to this cluster
export const apps: types.AppArgs[] = [
	// {
	// 	name: 'cluster-db',
	// 	image: 'postgres:10.15',
	// 	replicas: 1, // must be 1 for pg
	// 	port: 5432,
	// 	provider: config.provider,

	// 	env: [{
	// 		name: 'PGDATA',
	// 		value: '/var/lib/postgresql/data/pgdata',
	// 	},{
	// 		name: 'POSTGRES_PASSWORD',
	// 		value: 'password',
	// 	}],
	// 	volumeMounts: [{
	// 		mountPath: '/var/lib/postgresql/data',
	// 		name: 'cluster-db-volume-abc',
	// 	}],
	// 	volumes: [{
	// 		name: 'cluster-db-volume-abc',
	// 		persistentVolumeClaim: {
	// 			// See "volumes" project to manage claims / retrieve names
	// 			claimName: 'personal-pvc-5gi',
	// 		},
	// 	}],

	// 	hosts: [],
	// },
	{
		name: 'personal-site-webapp',
		image: 'wheresmycookie/personal-site',
		replicas: 2,
		port: 80, // always http - use ssl termination
		provider: config.provider,

		hosts: [
			'www.robertkotcher.me',
			'robertkotcher.me'
		],
	},
];

// ---------- SHOULD NOT HAVE TO MODIFY BELOW HERE ---------

interface HostServiceMapping {
	host: string
	port: number
	serviceName: pulumi.Output<string>	
}

// A HostServiceMapping defines a relationship between a set of
// hosts and a backend. Extracted out of App because we want all hosts
// and backends in the same ingress
const allHosts: string[] = [];
const hostServiceMappings: HostServiceMapping[] = [];
apps.forEach(args => {
	const initializedApp = new types.App(args.name, args);

	// append hosts to full list
	args.hosts.forEach(host => allHosts.push(host));

	initializedApp.hosts.forEach(host => 
		hostServiceMappings.push({
			host,
			port: initializedApp.port,
			serviceName: initializedApp.serviceName,
		}))
});

// using networking.v1beta1.Ingress because it deprecates
// extensions/v1beta1/Ingress, which is supposed to work in k8s cluster
// < 1.20 but with DO at least, it doesn't seem to be the case
const ingressName = 'single-ingress';
new k8s.networking.v1.Ingress(ingressName, {
	metadata: {
		name: ingressName,
		annotations: {
			'cert-manager.io/cluster-issuer': 'letsencrypt-prod'
		}
	},
	spec: {
		tls: [{
			hosts: allHosts,
			secretName: 'personal-site-tls'
		}],
		rules: hostServiceMappings.map(hsm => {
			return {
				host: hsm.host,
				http: {
					paths: [{
						path: '/',
						pathType: 'Prefix',
						backend: {
							service: {
								name: hsm.serviceName,
								port: {
									number: hsm.port,
								}
							}
						}
					}]
				},
			};
		}),
	}
}, { provider: config.provider });
