const form = document.querySelector('#mix-form');
const status = document.querySelector('#result-status');
const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 1 });
const points = new Intl.NumberFormat('en', { maximumFractionDigits: 1 });
const roundNames = ['r1', 'r2'];
const questionGroups = ['discovery', 'named'];

function readGroup(round, group) {
  const mentions = document.getElementById(`${round}-${group}-mentions`);
  const total = document.getElementById(`${round}-${group}-total`);
  const mentioned = mentions.valueAsNumber;
  const completed = total.valueAsNumber;
  mentions.setCustomValidity(mentioned > completed ? 'Brand mentions cannot exceed completed answers.' : '');
  return { mentioned, completed, rate: mentioned / completed };
}

function describeChange(before, after) {
  const difference = Math.round((after - before) * 1000) / 10;
  if (difference === 0) return 'stayed the same';
  const direction = difference > 0 ? 'rose' : 'fell';
  const amount = Math.abs(difference);
  return `${direction} by ${points.format(amount)} ${amount === 1 ? 'point' : 'points'}`;
}

function updateComparison() {
  const rounds = roundNames.map(round => questionGroups.map(group => readGroup(round, group)));
  if (!form.reportValidity()) return;
  const calculated = rounds.map(([discovery, named]) => ({
    discovery: discovery.rate,
    named: named.rate,
    overall: (discovery.mentioned + named.mentioned) / (discovery.completed + named.completed),
    equal: (discovery.rate + named.rate) / 2,
  }));
  calculated.forEach((rates, index) => {
    for (const [measure, value] of Object.entries(rates)) {
      document.getElementById(`${roundNames[index]}-${measure}`).textContent = percent.format(value);
    }
  });
  const [first, second] = calculated;
  status.textContent = `The overall rate ${describeChange(first.overall, second.overall)}. With equal weights, it ${describeChange(first.equal, second.equal)}.`;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  updateComparison();
});
form.addEventListener('input', () => {
  for (const field of form.querySelectorAll('input')) field.setCustomValidity('');
});
form.addEventListener('reset', () => {
  for (const field of form.querySelectorAll('input')) field.setCustomValidity('');
  setTimeout(updateComparison, 0);
});
form.hidden = false;
