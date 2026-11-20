const form = document.querySelector('#compare-form');
const earlier = document.querySelector('#earlier');
const latest = document.querySelector('#latest');
const results = document.querySelector('#results');
const summary = document.querySelector('#summary');
const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });

function sentences(text) {
  return Array.from(segmenter.segment(text), ({ segment }) => segment.trim().replace(/\s+/g, ' '))
    .filter(Boolean);
}

function counts(values) {
  const occurrences = new Map();
  for (const value of values) {
    occurrences.set(value, (occurrences.get(value) ?? 0) + 1);
  }
  return occurrences;
}

function compare(earlierText, latestText) {
  const before = sentences(earlierText);
  const after = sentences(latestText);
  const remainingBefore = counts(before);
  const added = [];
  const matched = [];

  for (const sentence of after) {
    const remaining = remainingBefore.get(sentence) ?? 0;
    if (remaining === 0) {
      added.push(sentence);
      continue;
    }
    matched.push(sentence);
    remainingBefore.set(sentence, remaining - 1);
  }

  const remainingMatched = counts(matched);
  const missing = before.filter((sentence) => {
    const remaining = remainingMatched.get(sentence) ?? 0;
    if (remaining === 0) return true;
    remainingMatched.set(sentence, remaining - 1);
    return false;
  });
  return { added, missing, matched };
}

function renderList(selector, items) {
  const list = document.querySelector(selector);
  list.replaceChildren();
  for (const text of items.length ? items : ['None']) {
    const item = document.createElement('li');
    item.textContent = text;
    list.append(item);
  }
}

function render() {
  const { added, missing, matched } = compare(earlier.value, latest.value);
  renderList('#new-sentences', added);
  renderList('#missing-sentences', missing);
  renderList('#matched-sentences', matched);
  results.hidden = false;
  summary.textContent = `${added.length} new · ${missing.length} missing · ${matched.length} matched`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!earlier.value.trim() || !latest.value.trim()) {
    const empty = earlier.value.trim() ? latest : earlier;
    empty.setCustomValidity('Paste an answer before comparing.');
    empty.reportValidity();
    return;
  }
  render();
});

for (const input of [earlier, latest]) {
  input.addEventListener('input', () => {
    input.setCustomValidity('');
    results.hidden = true;
  });
}

document.querySelector('#sample').addEventListener('click', () => {
  earlier.value = 'Fictional example: Alder Atlas sells budgeting software. The starter plan includes CSV export. The official site has a pricing page.';
  latest.value = 'Fictional example: Alder Atlas sells budgeting software. CSV export is listed under the team plan. The official site has a pricing page.';
  earlier.setCustomValidity('');
  latest.setCustomValidity('');
  render();
});

form.addEventListener('reset', () => {
  earlier.setCustomValidity('');
  latest.setCustomValidity('');
  results.hidden = true;
  summary.textContent = '';
});
