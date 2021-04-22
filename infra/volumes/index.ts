import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

const name1Gi = 'personal-pvc-1gi';

export const pvc1Gi = new k8s.core.v1.PersistentVolumeClaim(
    name1Gi,
    {
        metadata: {
            name: name1Gi,
        },
        spec: {
            accessModes: [
                'ReadWriteOnce' // must be this value
            ],
            resources: {
                requests: {
                    storage: '1Gi'
                }
            },
            storageClassName: 'do-block-storage', // must be this value
        }
    }
);
