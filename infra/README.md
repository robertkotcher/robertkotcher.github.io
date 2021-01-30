# notes to future self:

- Separate out components early to avoid rate limiting. For example,
  with robertkotcher.me I hit a rate limit issue with provider &
  had to manually create the cert on the dashboard.

# Setting up cluster on digitalocean
Run `pulumi up` in this order:

## cluster

The cluster project defines a DO cluster resource, node pools, and node types

It is possible to create pools of different sizes, but for economic reasons
we'll probably generally be using DropletS1VCPU2GB

## app

The app project can be deployed once a cluster is available.

Apps are defined in index.ts

Other files, such as types.ts, should only be changed if a new touch point
is being added to deployments or services

## cert
## network

