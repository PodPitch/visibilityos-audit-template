const form = document.querySelector('#counts');
const summary = document.querySelector('#total');
const outputs = [...document.querySelectorAll('[data-source]')];
const number = new Intl.NumberFormat('en');
const percent = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 1 });
const example = { owned: 2, editorial: 3, directories: 1, communities: 2, other: 0 };

function render() {
  const inputs = outputs.map((row) => form.elements.namedItem(row.dataset.source));
  const isValid = inputs.every((input) => input.validity.valid);
  const total = isValid ? inputs.reduce((sum, input) => sum + input.valueAsNumber, 0) : 0;
  summary.textContent = 'Enter citation counts to see the mix.';

  if (total > 0) {
    summary.textContent = total === 1 ? '1 citation counted.' : number.format(total) + ' citations counted.';
  }
  if (!isValid) {
    summary.textContent = 'Enter a whole number from 0 to 9,999 in each field.';
  }

  outputs.forEach((row, index) => {
    const share = total ? inputs[index].valueAsNumber / total : 0;
    row.querySelector('strong').textContent = isValid ? percent.format(share) : 'Pending';
    row.querySelector('.bar').style.width = (share * 100) + '%';
  });
}

form.addEventListener('submit', (event) => event.preventDefault());
form.addEventListener('input', render);
form.addEventListener('reset', () => requestAnimationFrame(render));
document.querySelector('#example').addEventListener('click', () => {
  for (const [category, count] of Object.entries(example)) {
    form.elements.namedItem(category).value = count;
  }
  render();
  summary.textContent = 'Example with 8 citations.';
});
render();
