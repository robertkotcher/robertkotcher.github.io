import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

const name = 'personal-pvc-5gi';

export const pvc5Gi = new k8s.core.v1.PersistentVolumeClaim(
    name,
    {
        metadata: {
            name,
        },
        spec: {
            accessModes: [
                'ReadWriteOnce' // must be this value
            ],
            resources: {
                requests: {
                    storage: '5Gi'
                }
            },
            storageClassName: 'do-block-storage', // must be this value
        }
    }
);
