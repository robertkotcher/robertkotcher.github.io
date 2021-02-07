import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

// kvpair can be used to pass environment variable names or volumen mts, e.g.
type kvpair = {[key: string]: string};

// the key used to tag and subsequently target a deployment
const selectorKey = 'app';

export interface AppArgs {
	// required
	name: string; // The name of this app
	image: string; // image to deploy
	replicas: number; // number of replicas of this app to run
	port: number; // the port that this app is exposed on in container
	provider: k8s.Provider; // a kubernetes provider resource
	
	// optional
	hosts?: string[]; // The host that this image will be deployed to
						// if none, ingress will not be created.
	env?: k8s.types.input.core.v1.EnvVar[];
	volumeMounts?: k8s.types.input.core.v1.VolumeMount[];
	volumes?: k8s.types.input.core.v1.Volume[];
}

export class App extends pulumi.ComponentResource {
	constructor(name: string, args: AppArgs, opts: pulumi.ComponentResourceOptions = {}) {

		// This component resource defines apps that live on DO cluster
		super('rkotcher-do-apps', name, args, opts);

		const serviceName = `${name}-service`;
		const selectorName = `${args.name}-selector`;

		// create a service providing access to underlying deployment
		const svc = new k8s.core.v1.Service(serviceName, {
			metadata: {
				name: serviceName,
			},
			spec: {
				type: 'ClusterIP',
				selector: { [selectorKey]: selectorName },
				ports: [{
					name: 'http',
					protocol: 'TCP',

					// until there's a reason not to, we'll keep all ports the same.
					port: args.port,
					targetPort: args.port,
				}],
			},
		}, { provider: args.provider });

		new k8s.apps.v1.Deployment(name, {
			spec: {
				selector: { matchLabels: { [selectorKey]: selectorName }},
				replicas: args.replicas,
				template: {
					metadata: { labels: { [selectorKey]: selectorName }},
					spec: {
						containers: [{
							name: name,
							image: args.image,
							ports: [{
								containerPort: args.port,
								name: 'http',
							}],
							env: args.env,
							volumeMounts: args.volumeMounts,
						}],
						volumes: args.volumes,
					},
				},
			},
		}, { provider: args.provider });

		// using networking.v1beta1.Ingress because it deprecates
		// extensions/v1beta1/Ingress, which is supposed to work in k8s cluster
		// < 1.20 but with DO at least, it doesn't seem to be the case
		if (args.hosts) {
			new k8s.networking.v1.Ingress(`${name}-ingress`, {
				metadata: {
					name: `${name}-ingress`,
					annotations: {
						'cert-manager.io/cluster-issuer': 'letsencrypt-prod'
					}
				},
				spec: {
					tls: [{
						hosts: args.hosts,
						secretName: 'personal-site-tls'
					}],
					rules: args.hosts.map(host => {
						return {
							host: host,
							http: {
								paths: [{
									path: '/',
									pathType: 'Prefix',
									backend: {
										service: {
											name: svc.metadata.name,
											port: {
												number: args.port,
											}
										}
									}
								}]
							},
						};
					}),
				}
			}, { provider: args.provider });
		}
	}
}
