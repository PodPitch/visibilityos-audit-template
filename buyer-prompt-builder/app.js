const form = document.querySelector('#buyer-form');
const entries = [...document.querySelectorAll('#prompt-set li p')];
const copyButton = document.querySelector('#copy-all');
const status = document.querySelector('#status');
const fields = [...form.querySelectorAll('input')];

function buildPrompts(event) {
  event.preventDefault();
  for (const field of fields) {
    field.setCustomValidity(field.value.trim() ? '' : 'Enter a value for this field.');
  }
  if (!form.reportValidity()) return;

  const [category, buyer, task, brand] = fields.map(field => field.value.trim());
  const prompts = [
    `What ${category} should ${buyer} shortlist?`,
    `Which ${category} would help ${buyer} ${task}?`,
    `How should ${buyer} compare ${category} options when they need to ${task}?`,
    `What is ${brand} in the ${category} category? Cite the official product site if you can verify it.`,
    `Can ${brand} help ${buyer} ${task}? Cite the exact source for your answer.`,
  ];
  entries.forEach((entry, index) => { entry.textContent = prompts[index]; });
  status.textContent = 'Five prompts updated.';
}

async function copyPrompts() {
  const text = entries.map((entry, index) => {
    const group = index === 0 ? 'Open-ended discovery\n' : index === 3 ? '\nNamed product checks\n' : '';
    return `${group}${index + 1}. ${entry.textContent}`;
  }).join('\n');
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = 'All five prompts copied.';
  } catch {
    status.textContent = 'Clipboard access is unavailable. Select the prompt text to copy it.';
  }
}

form.addEventListener('submit', buildPrompts);
fields.forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));
copyButton.addEventListener('click', copyPrompts);
form.hidden = false;
copyButton.hidden = false;
