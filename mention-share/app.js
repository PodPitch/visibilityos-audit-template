import { calculatePeriod, difference } from './metrics.js';

const form = document.querySelector('form');
const feedback = document.getElementById('feedback');
const reading = document.getElementById('reading');
const periods = ['before', 'after'];
const fields = ['answers', 'brand', 'competitors'];
const metrics = ['rate', 'share'];
const formatter = new Intl.NumberFormat('en', { maximumFractionDigits: 1 });

function readPeriod(period) {
  const inputs = fields.map(field => document.getElementById(`${period}-${field}`));
  if (inputs.some(input => input.validity.badInput || input.value === '')) {
    return { error: 'Complete all three counts.' };
  }
  return calculatePeriod(Object.fromEntries(fields.map((field, index) =>
    [field, inputs[index].valueAsNumber]
  )));
}

function showChange(metric, change) {
  const result = document.getElementById(`${metric}-change`);
  result.className = 'change';
  if (change === null) {
    result.textContent = 'N/A';
  } else if (change === 0) {
    result.textContent = '0 pts';
  } else if (Math.abs(change) < 0.05) {
    result.textContent = (change > 0 ? '+' : '−') + '<0.1 pt';
    result.classList.add(change > 0 ? 'up' : 'down');
  } else {
    result.textContent = (change > 0 ? '+' : '−') + formatter.format(Math.abs(change)) + ' pts';
    result.classList.add(change > 0 ? 'up' : 'down');
  }
}

function update() {
  const [before, after] = periods.map(readPeriod);
  const errors = [before, after].flatMap((result, index) =>
    result.error ? [`${index === 0 ? 'Before' : 'After'}. ${result.error}`] : []
  );
  feedback.hidden = errors.length === 0;
  feedback.textContent = errors.join(' ');

  for (const [index, result] of [before, after].entries()) {
    for (const metric of metrics) {
      const value = result[metric];
      document.getElementById(`${periods[index]}-${metric}`).textContent =
        value == null ? 'N/A' : `${formatter.format(value)}%`;
    }
  }

  const rateChange = difference(before.rate ?? null, after.rate ?? null);
  const shareChange = difference(before.share ?? null, after.share ?? null);
  showChange('rate', rateChange);
  showChange('share', shareChange);

  if (errors.length) {
    reading.textContent = 'Complete both samples to compare the two periods.';
  } else if (rateChange === null || shareChange === null) {
    reading.textContent = 'A change is available when the metric can be calculated for both samples.';
  } else if (rateChange > 0 && shareChange < 0) {
    reading.textContent = 'Your brand appears in more answers per 100, while its share of tracked-brand mentions fell.';
  } else if (rateChange < 0 && shareChange > 0) {
    reading.textContent = 'Your brand appears in fewer answers per 100, while its share of tracked-brand mentions rose.';
  } else {
    reading.textContent = 'Both changes are measured in percentage points.';
  }
}

form.addEventListener('input', update);
form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('reset', () => requestAnimationFrame(update));
update();
