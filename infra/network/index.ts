import * as digitalocean from '@pulumi/digitalocean';

const name = 'robertkotcher-dot-me';

const loadbalancerIP = '178.128.128.153';

const domain = new digitalocean.Domain(name, {
    name: 'robertkotcher.me',
});

const www = new digitalocean.DnsRecord('kotcherrobert-cname-record', {
    domain: domain.name,
    type: 'CNAME',
    name: 'www',
    value: '@',
});

const blog = new digitalocean.DnsRecord('kotcherrobert-blog-cname-record', {
    domain: domain.name,
    type: 'CNAME',
    name: 'blog',
    value: '@',
});

const kvstore = new digitalocean.DnsRecord('kotcherrobert-kvstore-cname-record', {
    domain: domain.name,
    type: 'CNAME',
    name: 'kvstore',
    value: '@',
});

const dumpall = new digitalocean.DnsRecord('kotcherrobert-dumpall-cname-record', {
    domain: domain.name,
    type: 'CNAME',
    name: 'dumpall',
    value: '@',
});

// TODO: grab service from helm chart, grab load balancer ID from that. Partial
// example of that is in initial commit of this repository
const aRecord = new digitalocean.DnsRecord('kotcherrobert-a-record', {
    name: '@',
    domain: domain.name,
    type: 'A',
    value: loadbalancerIP,
});

const workaround = new digitalocean.DnsRecord('kotcherrobert-workaround', {
    domain: domain.name,
    type: 'CNAME',
    name: 'workaround',
    value: '@',
});
