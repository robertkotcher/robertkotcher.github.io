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
	targetPort?: number; // used if different from port
	provider: k8s.Provider; // a kubernetes provider resource
	
	// optional
	hosts: string[]; // The host that this image will be deployed to
						// if none, ingress will not be created.
	env?: k8s.types.input.core.v1.EnvVar[];
	volumeMounts?: k8s.types.input.core.v1.VolumeMount[];
	volumes?: k8s.types.input.core.v1.Volume[];
}

export class App extends pulumi.ComponentResource {
	public readonly serviceName!: pulumi.Output<string>;
	public readonly hosts: string[];
	public readonly port: number;

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
					targetPort: args.targetPort || args.port,
				}],
			},
		}, { provider: args.provider });

		this.serviceName = svc.metadata.name;
		this.hosts = args.hosts;
		this.port = args.port;

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
								containerPort: args.targetPort || args.port,
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
	}
}
