import * as digitalocean from '@pulumi/digitalocean';

const name = 'robertkotcher-dot-me';

const domain = new digitalocean.Domain(name, {
    name: 'robertkotcher.me',
});

const cnameRecord = new digitalocean.DnsRecord('kotcherrobert-cname-record', {
    domain: domain.name,
    type: 'CNAME',
    name: 'www',
    value: '@',
});

// TODO: grab service from helm chart, grab load balancer ID from that. Partial
// example of that is in initial commit of this repository
const aRecord = new digitalocean.DnsRecord('kotcherrobert-a-record', {
    name: '@',
    domain: domain.name,
    type: 'A',
    value: '157.230.72.71',
});
