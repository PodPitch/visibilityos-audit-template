import {classifyAddress} from './finder.mjs';

const form = document.getElementById('check-form');
const address = document.getElementById('address');
const result = document.getElementById('result');
const resultHost = document.getElementById('result-host');
const resultTitle = document.getElementById('result-title');
const resultDetail = document.getElementById('result-detail');
const resultLink = document.getElementById('result-link');

function showResult() {
  const match = classifyAddress(address.value);
  result.dataset.kind = match.kind;
  resultHost.textContent = match.host ?? '';
  resultHost.hidden = !match.host;
  resultTitle.textContent = match.title;
  resultDetail.textContent = match.detail;
  resultLink.hidden = !match.href;
  resultLink.textContent = match.label ?? '';
  if (match.href) resultLink.href = match.href;
  else resultLink.removeAttribute('href');
  result.hidden = false;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  showResult();
});
address.addEventListener('input', () => { result.hidden = true; });
for (const example of document.querySelectorAll('[data-address]')) {
  example.addEventListener('click', () => {
    address.value = example.dataset.address;
    showResult();
  });
}
