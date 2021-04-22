import * as k8s from "@pulumi/kubernetes";
import { config } from './config';

const cacheVolumeName = 'volume-cache-file-storage';
const pvcName = 'personal-pvc-1gi';

// Create an example CronJob.
new k8s.batch.v1beta1.CronJob("generic-cron-weekly", {
    spec: {
        successfulJobsHistoryLimit: 1,
        failedJobsHistoryLimit: 5,
        // Run once a week at midnight on Sunday morning
        schedule: "0 0 * * 0",
        jobTemplate: {
            spec: {
                template: {
                    spec: {
                        containers: [{
                            name: "generic-cron-weekly-pod",
                            image: "busybox",
                            args: ["/bin/sh",  "-c", "date >> /usr/local/cache"],
                            volumeMounts: [{
                                name: cacheVolumeName,
                                mountPath: '/usr/local',
                            }]
                        }],
                        volumes: [{
                            name: cacheVolumeName,
                            persistentVolumeClaim: {
                                claimName: pvcName,
                            }
                        }],
                        restartPolicy: "OnFailure"
                    }
                },
            }
        },
    }
}, { provider: config.provider });