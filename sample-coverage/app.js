const form = document.querySelector('#sample');
const fields = ['planned', 'completed', 'brand', 'links'].map((name) => form.elements.namedItem(name));
const number = new Intl.NumberFormat('en');
const percentage = new Intl.NumberFormat('en', { style: 'percent', maximumFractionDigits: 1 });
const unavailable = 'Unavailable';
const example = [48, 40, 5, 4];

const coverageOutput = document.querySelector('#coverage');
const missingOutput = document.querySelector('#missing');
const brandOutput = document.querySelector('#brand-rate');
const linkOutput = document.querySelector('#link-rate');
const message = document.querySelector('#message');

function calculate() {
  const [planned, completed, brand, links] = fields.map((field) => field.valueAsNumber);
  const numbersValid = fields.every((field) => field.validity.valid);
  const totalsValid = numbersValid && completed <= planned && brand <= completed && links <= completed;

  coverageOutput.textContent = totalsValid && planned ? percentage.format(completed / planned) : unavailable;
  missingOutput.textContent = totalsValid && planned ? number.format(planned - completed) : unavailable;
  brandOutput.textContent = totalsValid && completed ? percentage.format(brand / completed) : unavailable;
  linkOutput.textContent = totalsValid && completed ? percentage.format(links / completed) : unavailable;

  if (!numbersValid) {
    message.textContent = 'Enter a whole number from 0 to 1,000,000 in every field.';
    return;
  }
  if (!totalsValid) {
    message.textContent = 'Completed comparisons cannot exceed the plan, and changes cannot exceed completed comparisons.';
    return;
  }
  if (!planned) {
    message.textContent = 'Enter planned comparisons to begin.';
    return;
  }
  message.textContent = completed
    ? number.format(completed) + ' of ' + number.format(planned) + ' planned comparisons completed.'
    : 'No comparisons were completed. Change rates are unavailable.';
}

form.addEventListener('input', calculate);
form.addEventListener('submit', (event) => event.preventDefault());
form.addEventListener('reset', () => requestAnimationFrame(calculate));
document.querySelector('#example').addEventListener('click', () => {
  fields.forEach((field, index) => { field.value = example[index]; });
  calculate();
});
calculate();
