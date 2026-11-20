'use strict';

function calculateAgreement([bothNamed, firstOnly, secondOnly, bothAbsent]) {
  const total = bothNamed + firstOnly + secondOnly + bothAbsent;
  if (!total) return null;

  const matching = bothNamed + bothAbsent;
  const firstNamed = bothNamed + firstOnly;
  const secondNamed = bothNamed + secondOnly;
  const expectedPairs = firstNamed * secondNamed + (total - firstNamed) * (total - secondNamed);
  const possiblePairs = total * total;
  const remainingPairs = possiblePairs - expectedPairs;
  return {
    total,
    observed: matching / total,
    expected: expectedPairs / possiblePairs,
    kappa: remainingPairs ? (matching * total - expectedPairs) / remainingPairs : null,
  };
}

const form = document.querySelector('#review-counts');
const fields = [...form.querySelectorAll('input')];
const results = document.querySelector('#results');
const status = document.querySelector('#status');
const resultNote = document.querySelector('#result-note');
const defaultNote = resultNote.textContent;
const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 1 });
const whole = new Intl.NumberFormat('en', { maximumFractionDigits: 0 });
const kappaNumber = new Intl.NumberFormat('en', {
  minimumFractionDigits: 3, maximumFractionDigits: 3, signDisplay: 'exceptZero',
});

function renderAgreement() {
  const counts = fields.map(field => {
    const value = field.value.trim();
    const valid = /^\d{1,7}$/.test(value) && Number(value) <= 1_000_000;
    field.setAttribute('aria-invalid', String(!valid));
    return valid ? Number(value) : null;
  });
  const hasInvalidCount = counts.includes(null);
  const result = hasInvalidCount ? null : calculateAgreement(counts);
  results.hidden = !result;
  status.hidden = !!result;
  if (!result) {
    status.textContent = hasInvalidCount
      ? 'Enter a whole number from 0 to 1,000,000 in every cell.'
      : 'Enter at least one answer reviewed by both people.';
    return;
  }

  document.querySelector('#observed').textContent = percent.format(result.observed);
  document.querySelector('#total').textContent = whole.format(result.total);
  document.querySelector('#expected').textContent = percent.format(result.expected);
  document.querySelector('#kappa').textContent =
    result.kappa === null ? 'Undefined' : kappaNumber.format(result.kappa).replace('-', '−');
  resultNote.textContent = result.kappa === null
    ? 'Both reviewers used only the same label. Expected agreement is 100%, so kappa is undefined.'
    : defaultNote;
}

form.addEventListener('input', renderAgreement);
form.addEventListener('submit', event => event.preventDefault());
for (const button of form.querySelectorAll('[data-counts]')) {
  button.addEventListener('click', () => {
    const sample = button.dataset.counts.split(',');
    fields.forEach((field, index) => { field.value = sample[index]; });
    renderAgreement();
  });
}
