# Setting up cluster on digitalocean

## cluster

The cluster project defines a DO cluster resource, node pools, and node types

It is possible to create pools of different sizes, but for economic reasons
we'll probably generally be using DropletS1VCPU2GB

## cluster-services / ingress

This project installs a DO load balancer that forwards traffic to an
nginx ingress controller.

The project does not install any ingress resources, but is a prerequisite
for doing so.

## network

Once we have the IP address of the LB, this project will create an A record
(and CNAME for www)

TODO: import IP address from helm chart in previous step.

## app

The app project can be deployed once a cluster is available.

Apps are defined in index.ts

Other files, such as types.ts, should only be changed if a new touch point
is being added to deployments or services

For each app, a deployment, service, and ingress resource is created.

## cert

At the moment, cert-manager is just yaml files. If there's a reason to
encode this with a pulumi project I'll do so at that point.

