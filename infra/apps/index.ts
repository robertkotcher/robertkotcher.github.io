import * as types from './types';

import { config } from './config';

// apps defines the different apps deployed to this cluster
export const apps: types.AppArgs[] = [
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
	{
		name: 'cluster-db',
		image: 'postgres:10.15',
		replicas: 1, // must be 1 for pg
		port: 5432,
		provider: config.provider,

		env: [{
			name: 'PGDATA',
			value: '/var/lib/postgresql/data/pgdata',
		},{
			name: 'POSTGRES_PASSWORD',
			value: 'password',
		}],
		volumeMounts: [{
			mountPath: '/var/lib/postgresql/data',
			name: 'cluster-db-volume-123',
		}],
		volumes: [{
			name: 'cluster-db-volume-123',
			persistentVolumeClaim: {
				// See "volumes" project to manage claims / retrieve names
				claimName: 'personal-pvc',
			},
		}]
	}
];

// apps are logic abstractions so we need to iterate through them
// and create them as individual resources
apps.forEach(args => new types.App(args.name, args));

