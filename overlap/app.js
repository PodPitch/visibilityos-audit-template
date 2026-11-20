import { countsForOverlap, minOverlap, maxOverlap } from './metrics.js';

const slider = document.getElementById('overlap');
const readout = document.getElementById('overlap-value');
const strip = Array.from(document.querySelectorAll('[data-count]'));

slider.min = minOverlap;
slider.max = maxOverlap;

function render() {
  const counts = countsForOverlap(slider.valueAsNumber);
  readout.value = counts.both;
  slider.setAttribute('aria-valuetext', `${counts.both} comparisons changed on both measures`);
  for (const [group, count] of Object.entries(counts)) {
    document.getElementById(group).textContent = count;
  }
  for (const segment of strip) {
    segment.style.setProperty('--count', counts[segment.dataset.count]);
  }
}

function selectOverlap(overlap) {
  slider.value = overlap;
  render();
}

slider.addEventListener('input', render);
document.getElementById('min-overlap').addEventListener('click', () => selectOverlap(minOverlap));
document.getElementById('max-overlap').addEventListener('click', () => selectOverlap(maxOverlap));
render();
