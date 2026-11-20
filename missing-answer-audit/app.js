'use strict';

function calculateChange(counts) {
  const [namedNamed, namedAbsent, namedMissing, absentNamed, absentAbsent,
    absentMissing, missingNamed, missingAbsent, missingMissing] = counts;
  const total = counts.reduce((sum, count) => sum + count, 0);
  const complete = namedNamed + namedAbsent + absentNamed + absentAbsent;
  const net = absentNamed - namedAbsent;
  return {
    total,
    complete,
    net,
    min: net - namedMissing - missingAbsent - missingMissing,
    max: net + absentMissing + missingNamed + missingMissing,
  };
}

const countFormat = new Intl.NumberFormat('en', { maximumFractionDigits: 0 });
const pointsFormat = new Intl.NumberFormat('en', { maximumFractionDigits: 1 });
const smallPointsFormat = new Intl.NumberFormat('en', { maximumSignificantDigits: 2 });

function formatChange(delta, total) {
  if (delta === 0) return '0';
  const points = Math.abs(delta) / total * 100;
  const formatter = points < 0.1 ? smallPointsFormat : pointsFormat;
  return (delta < 0 ? '−' : '+') + formatter.format(points);
}

const countsForm = document.querySelector('#pair-counts');
const fields = [...countsForm.querySelectorAll('input')];
const results = document.querySelector('#results');
const statusMessage = document.querySelector('#status');

function renderResults() {
  const counts = fields.map(field => {
    const value = field.value.trim();
    const isValid = /^\d{1,7}$/.test(value) && Number(value) <= 1_000_000;
    field.setAttribute('aria-invalid', String(!isValid));
    return isValid ? Number(value) : null;
  });
  const hasInvalidCount = counts.includes(null);
  const canShow = !hasInvalidCount && counts.some(count => count > 0);
  results.hidden = !canShow;
  statusMessage.hidden = canShow;
  if (!canShow) {
    statusMessage.textContent = hasInvalidCount
      ? 'Enter a whole number from 0 to 1,000,000 in every cell.'
      : 'Enter at least one answer pair to see the range.';
    return;
  }

  const { total, complete, net, min, max } = calculateChange(counts);
  const lowLabel = formatChange(min, total);
  const highLabel = formatChange(max, total);
  document.querySelector('#range').textContent = min === max
    ? lowLabel + ' points'
    : lowLabel + ' to ' + highLabel + ' points';
  document.querySelector('#direction').textContent = min > 0
    ? 'The full set shows a gain under every possible completion.'
    : max < 0
      ? 'The full set shows a loss under every possible completion.'
      : min === 0 && max === 0
        ? 'Every possible completion produces zero net change.'
        : min < 0 && max > 0
          ? 'The direction could change depending on the missing answers.'
          : 'The range includes zero change.';
  document.querySelector('#known-change').textContent = complete
    ? formatChange(net, complete) + ' points'
    : 'Unavailable';
  document.querySelector('#sample').textContent =
    countFormat.format(complete) + ' of ' + countFormat.format(total);
}

countsForm.addEventListener('input', renderResults);
countsForm.addEventListener('reset', () => setTimeout(renderResults, 0));
countsForm.addEventListener('submit', event => event.preventDefault());
