# notes to future self:

- Separate out components early to avoid rate limiting. For example,
  with robertkotcher.me I hit a rate limit issue with provider &
  had to manually create the cert on the dashboard.

# Setting up cluster on digitalocean
Run `pulumi up` in this order:

1. cluster
2. app/personal_site
3. cert
4. network

1 and 2 are pretty straightforward and should work immediately. Once certs
are generated they shouldn't need to be updated. Finally, mess around with
network. This one gave the most issues but also I didn't run into any
rate limiting here.

# Issues

- Could not seem to find a way to make LB an http router. I had to
  update this manually.
