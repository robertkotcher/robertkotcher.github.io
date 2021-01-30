import * as digitalocean from "@pulumi/digitalocean";
import * as fs from 'fs';

export const name = "robertkotcher.me";

const domain = new digitalocean.Domain("robertkotcher-me-domain", {
    name: name,
});

const cert = new digitalocean.Certificate("robertkotcher-me-cert", {
	  domains: ["example.com"],
    type: "lets_encrypt",
});

export const certId = cert.id;
