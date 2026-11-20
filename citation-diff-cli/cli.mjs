#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { domainToASCII } from 'node:url';
import { parseArgs } from 'node:util';

const usage = `Usage: visibilityos-citation-diff <before.txt> <after.txt> [--brand-domain example.com] [--json]

Each file should contain one HTTP or HTTPS citation URL per line.
The tool reads local files and makes no network requests.`;

function citationUrl(value) {
  if (!/^https?:\/\//i.test(value) || /[\s\\]/u.test(value) || !URL.canParse(value)) {
    return null;
  }
  const url = new URL(value);
  if (!url.hostname || url.username || url.password) return null;
  url.hostname = url.hostname.replace(/\.$/u, '');
  url.hash = '';
  return url.href;
}

function readCitations(path) {
  const citations = new Set();
  const lines = readFileSync(path, 'utf8').split(/\r?\n/u);
  for (const [index, line] of lines.entries()) {
    const value = line.trim();
    if (!value) continue;
    const url = citationUrl(value);
    if (!url) {
      throw new Error(`${path}:${index + 1}: Expected an HTTP or HTTPS citation URL without credentials or spaces.`);
    }
    citations.add(url);
  }
  return citations;
}

function normalizeBrandDomain(domain) {
  const bareDomain = domain.trim().toLowerCase().replace(/\.$/u, '').replace(/^www\./u, '');
  if (/[\s:/@?#\\%[\]]/u.test(bareDomain)) {
    throw new Error('--brand-domain must be a bare domain, such as example.com.');
  }
  const asciiDomain = domainToASCII(bareDomain);
  const labels = asciiDomain.split('.');
  if (labels.length < 2 || labels.some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/u.test(label))) {
    throw new Error('--brand-domain must be a bare domain, such as example.com.');
  }
  return asciiDomain;
}

function citationHosts(citations) {
  return new Set([...citations].map(citation => new URL(citation).hostname.replace(/^www\./u, '')));
}

function difference(left, right) {
  return [...left].filter(value => !right.has(value)).sort();
}

function citesDomain(hosts, domain) {
  return [...hosts].some(host => host === domain || host.endsWith(`.${domain}`));
}

function compare(before, after, domain) {
  const beforeHosts = citationHosts(before);
  const afterHosts = citationHosts(after);
  const result = {
    pagesAdded: difference(after, before),
    pagesRemoved: difference(before, after),
    hostsAdded: difference(afterHosts, beforeHosts),
    hostsRemoved: difference(beforeHosts, afterHosts),
  };
  if (domain) {
    result.officialDomain = {
      domain,
      citedBefore: citesDomain(beforeHosts, domain),
      citedAfter: citesDomain(afterHosts, domain),
    };
  }
  return result;
}

function printReport(result) {
  const sections = [
    ['Pages added', result.pagesAdded],
    ['Pages removed', result.pagesRemoved],
    ['Hosts added', result.hostsAdded],
    ['Hosts removed', result.hostsRemoved],
  ];
  for (const [label, values] of sections) {
    process.stdout.write(`${label} (${values.length})\n`);
    for (const value of values) process.stdout.write(`  ${value}\n`);
  }
  if (result.officialDomain) {
    const { domain, citedBefore, citedAfter } = result.officialDomain;
    process.stdout.write(`Official domain (${domain}): ${citedBefore ? 'cited' : 'absent'} before, ${citedAfter ? 'cited' : 'absent'} after\n`);
  }
}

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      'brand-domain': { type: 'string' },
      json: { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
  });
  if (values.help) {
    process.stdout.write(`${usage}\n`);
    return;
  }
  if (positionals.length !== 2) throw new Error(usage);

  const [beforeFile, afterFile] = positionals;
  const domain = values['brand-domain'] === undefined ? null : normalizeBrandDomain(values['brand-domain']);
  const result = compare(readCitations(beforeFile), readCitations(afterFile), domain);
  if (values.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }
  printReport(result);
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 2;
}
