import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

export const pvc = new k8s.core.v1.PersistentVolumeClaim(
    'personal-pvc',
    {
        metadata: {
            name: 'personal-pvc'
        },
        spec: {
            accessModes: [
                'ReadWriteOnce' // must be this value
            ],
            resources: {
                requests: {
                    storage: '10Gi'
                }
            },
            storageClassName: 'do-block-storage', // must be this value
        }
    }
);
