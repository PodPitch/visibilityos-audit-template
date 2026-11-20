import { checkCsv, sizeLimit } from './validate.mjs';

const form = document.querySelector('form');
const file = document.querySelector('#file');
const csv = document.querySelector('#csv');
const example = document.querySelector('#example');
const status = document.querySelector('#status');
const counts = document.querySelector('#counts');
const issues = document.querySelector('#issues');

function showError(message) {
  status.textContent = message;
  counts.hidden = true;
  issues.hidden = true;
  issues.replaceChildren();
}

function showResults({ valid, matched, unpaired, issues: messages, total }) {
  if (!total) {
    showError('Add at least one observation below the header.');
    return;
  }

  status.textContent = messages.length
    ? 'Fix the rows below. The totals count only the valid, non-duplicate observations.'
    : 'The file passed the format and duplicate checks.';

  for (const [name, value] of Object.entries({ valid, matched, unpaired })) {
    document.querySelector(`#${name}`).textContent = value.toLocaleString('en');
  }
  counts.hidden = false;
  const shown = messages.slice(0, 40);
  if (shown.length < messages.length) shown.push(`Plus ${messages.length - shown.length} more rows to fix.`);
  issues.replaceChildren(...shown.map((message) => {
    const item = document.createElement('li');
    item.textContent = message;
    return item;
  }));
  issues.hidden = !shown.length;
}

function setBusy(isBusy) {
  for (const control of form.elements) control.disabled = isBusy;
}

async function run(readText) {
  setBusy(true);
  try {
    showResults(checkCsv(await readText()));
  } catch (error) {
    showError(error.message);
  } finally {
    setBusy(false);
  }
}

csv.addEventListener('input', () => { file.value = ''; });
file.addEventListener('change', () => { if (file.files.length) csv.value = ''; });

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const chosen = file.files[0];
  run(() => {
    if (!chosen) return csv.value;
    if (chosen.size > sizeLimit) throw new Error('Choose a CSV under 5 MB.');
    return chosen.text();
  });
});

example.addEventListener('click', () => {
  run(async () => {
    const response = await fetch('sample.csv');
    if (!response.ok) throw new Error('Could not load the sample. You can still check your own CSV.');
    const sample = await response.text();
    file.value = '';
    csv.value = sample;
    return sample;
  });
});
