import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

// all services are available on port 80
const servicePort = 80;

// the key used to tag and subsequently target a deployment
const selectorKey = 'app';

// Args are the parameters that control the touch points of the app wrt the
// rest of the k8s cluster
export interface Args {
	hosts: string[]; // The host that this image will be deployed to
	name: string; // The name of this app
	provider: k8s.Provider; // a kubernetes provider resource
	image: string; // image to deploy
	selector: string; // tag identifying image
	replicas: number; // number of replicas of this app to run
	containerPort: number; // the port that this app is exposed on in container
}

// An App is a resource that deploys some number of replicas of an image as
// a deployment and exposes that deployment as a service
export class App extends pulumi.ComponentResource {
	constructor(name: string, args: Args, opts: pulumi.ComponentResourceOptions = {}) {

		// This component resource defines apps that live on DO cluster
		super('rkotcher-do-apps', name, args, opts);

		const serviceName = `${name}-service`;

		// create a service providing access to
		const svc = new k8s.core.v1.Service(serviceName, {
			metadata: {
				name: serviceName,
			},
			spec: {
				type: 'ClusterIP',
				selector: { [selectorKey]: args.selector },
				ports: [{
					name: 'http',
					protocol: 'TCP',
					port: servicePort,
					targetPort: args.containerPort,
				}],
			},
		}, { provider: args.provider });

		new k8s.apps.v1.Deployment(name, {
			spec: {
				selector: { matchLabels: { [selectorKey]: args.selector }},
				replicas: args.replicas,
				template: {
					metadata: { labels: { [selectorKey]: args.selector }},
					spec: {
						containers: [{
							name: name,
							image: args.image,
							ports: [{
								containerPort: args.containerPort,
								name: 'http',
							}],
						}],
					},
				},
			},
		}, { provider: args.provider });

		// using networking.v1beta1.Ingress because it deprecates
		// extensions/v1beta1/Ingress, which is supposed to work in k8s cluster
		// < 1.20 but with DO at least, it doesn't seem to be the case
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
											number: servicePort
										}
									}
								}
							}]
						},
					};
				}),
				// rules: [{
				// 	host: args.host,
				// 	http: {
				// 		paths: [{
				// 			path: '/',
				// 			pathType: 'Prefix',
				// 			backend: {
				// 				service: {
				// 					name: svc.metadata.name,
				// 					port: {
				// 						number: servicePort
				// 					}
				// 				}
				// 			}
				// 		}]
				// 	},
				// }]
			}
		}, { provider: args.provider });
	}
}

