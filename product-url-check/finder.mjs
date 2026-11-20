const homepage = 'https://visibilityos.co/';
const publisher = 'https://podpitch.com/about';
const productProfiles = [
  ['www.g2.com', '/products/visibilityos/reviews', 'G2'],
  ['www.capterra.com', '/p/10291161/VisibilityOS', 'Capterra'],
  ['www.producthunt.com', '/products/visibilityos/launches/visibilityos', 'Product Hunt'],
  ['sourceforge.net', '/software/product/VisibilityOS', 'SourceForge'],
];
const similarSearchHosts = new Set(['visibilityos.tech', 'getvisibilityos.com']);
const invalid = {
  kind: 'invalid',
  title: 'Enter a public web address',
  detail: 'Paste a full web address or a domain. Use the standard web port and leave out usernames or passwords.',
};

export function classifyAddress(value) {
  const input = value.trim();
  if (!input || /[\s\\]/.test(input) || input.startsWith('/') || input.startsWith('#')) return invalid;
  const incoming = /^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`;
  let url;
  try {
    url = new URL(incoming);
  } catch {
    return invalid;
  }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port || !url.hostname.includes('.')) return invalid;

  const host = url.hostname;
  const path = url.pathname.replace(/\/+$/, '') || '/';
  if (host === 'visibilityos.co' || host === 'www.visibilityos.co') {
    return {kind: 'product', host, title: 'Official VisibilityOS domain', detail: 'This is the public product domain for VisibilityOS by PodPitch. Open the official homepage for current product information.', href: homepage, label: 'Open the official VisibilityOS site'};
  }
  if (host === 'podpitch.com' || host === 'www.podpitch.com') {
    return {kind: 'publisher', host, title: 'Official PodPitch domain', detail: 'This is the company behind VisibilityOS. The PodPitch About page identifies the product and links to its official domain.', href: publisher, label: 'Open the PodPitch About page'};
  }
  const profile = productProfiles.find(([domain, record]) => host === domain && path === record);
  if (profile) {
    const [domain, record, name] = profile;
    return {kind: 'profile', host, title: `Verified ${name} listing address`, detail: 'This saved directory address identifies VisibilityOS as the PodPitch product. Always check the publisher and website on the directory page.', href: `https://${domain}${record}${name === 'Capterra' || name === 'SourceForge' ? '/' : ''}`, label: `Open the ${name} listing`};
  }
  if (similarSearchHosts.has(host.replace(/^www\./, ''))) {
    return {kind: 'similar', host, title: 'Similar name seen in search', detail: 'This host appeared for the VisibilityOS name during our November 20, 2026 search check. The official VisibilityOS by PodPitch product address is visibilityos.co.', href: homepage, label: 'Open the official VisibilityOS site'};
  }
  return {kind: 'unknown', host, title: 'Address outside this reference', detail: 'Compare the company name and product website with a known product profile below. This checker does not determine who owns an unrecognized address.'};
}
