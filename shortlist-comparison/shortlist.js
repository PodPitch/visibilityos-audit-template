const form = document.querySelector('#comparison');
const first = document.querySelector('#answer-a');
const second = document.querySelector('#answer-b');
const tracked = document.querySelector('#tracked');
const results = document.querySelector('#results');
const error = document.querySelector('#error');
const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 1 });

function cleanName(name) {
  return name.normalize('NFKC').trim().replace(/\s+/gu, ' ');
}

function uniqueBrands(text) {
  const brands = new Map();
  for (const rawName of text.split(/\r?\n/u)) {
    const name = cleanName(rawName);
    const key = name.toLowerCase();

    if (key && !brands.has(key)) {
      brands.set(key, name);
    }
  }
  return brands;
}

function renderList(selector, brands) {
  const names = brands.length ? brands : ['None'];
  const list = document.querySelector(selector);
  list.replaceChildren(...names.map((name) => {
    const item = document.createElement('li');
    item.textContent = name;
    return item;
  }));
}

function compareShortlists() {
  const brandsA = uniqueBrands(first.value);
  const brandsB = uniqueBrands(second.value);

  if (brandsA.size + brandsB.size === 0) {
    results.hidden = true;
    error.textContent = 'Add at least one brand to compare.';
    error.hidden = false;
    first.focus();
    return;
  }

  error.hidden = true;
  const shared = [];
  const onlyA = [];
  const onlyB = [];

  for (const [key, name] of brandsA) {
    (brandsB.has(key) ? shared : onlyA).push(name);
  }
  for (const [key, name] of brandsB) {
    if (!brandsA.has(key)) onlyB.push(name);
  }

  const distinct = shared.length + onlyA.length + onlyB.length;
  const overlap = shared.length / distinct;
  document.querySelector('#overlap').textContent = percent.format(overlap);
  document.querySelector('#result-count').textContent = distinct === 1
    ? `${shared.length} of 1 distinct brand appeared in both answers.`
    : `${shared.length} of ${distinct} distinct brands appeared in both answers.`;

  for (const [id, count, list] of [
    ['a', '#only-a', onlyA],
    ['shared', '#shared', shared],
    ['b', '#only-b', onlyB],
  ]) {
    document.querySelector(`#count-${id}`).textContent = list.length;
    document.querySelector(`#bar-${id}`).style.width = `${100 * list.length / distinct}%`;
    renderList(count, list);
  }

  const trackedName = cleanName(tracked.value);
  const trackedKey = trackedName.toLowerCase();
  const trackedResult = document.querySelector('#tracked-result');
  const firstHasBrand = brandsA.has(trackedKey);
  const secondHasBrand = brandsB.has(trackedKey);
  const location = firstHasBrand
    ? (secondHasBrand ? 'both answers' : 'the first answer only')
    : (secondHasBrand ? 'the second answer only' : 'neither answer');

  trackedResult.textContent = `${trackedName} appeared in ${location}.`;
  trackedResult.hidden = !trackedName;
  results.hidden = false;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  compareShortlists();
});

form.addEventListener('input', () => {
  error.hidden = true;
  results.hidden = true;
});

document.querySelector('#sample').addEventListener('click', () => {
  first.value = 'Juniper Stack\nMorrow Desk\nCedar Loop';
  second.value = 'Cedar Loop\nJuniper Stack\nAshline';
  tracked.value = 'Morrow Desk';
  compareShortlists();
});
