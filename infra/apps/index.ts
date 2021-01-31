import * as types from './types';

import { config } from './config';

// apps defines the different apps deployed to this cluster
// when deploying a new application these are the values that
// should be modified. If new touchpoints are added, those
// should be abstracted out in types.App, and values updated
// accordingly here:
export const apps: types.Args[] = [
	{
		host: 'robertkotcher.me',
		image: 'wheresmycookie/personal-site',
		provider: config.provider,
		name: 'personal-site-webapp',
		selector: 'personal-site-selector',
		replicas: 2,
		containerPort: 80, // always http - use ssl termination
	}
];

// apps are logic abstractions so we need to iterate through them
// and create them as individual resources
apps.forEach(args => new types.App(args.name, args));

