const fieldNames = ['date', 'prompt', 'engine', 'model', 'mode', 'country', 'language', 'location', 'brand',
  'mentioned', 'linked', 'answer_ref', 'source_urls'];

export function uniquePrompts(text) {
  return [...new Set(text.split(/\r?\n/u).map(line => line.trim()).filter(Boolean))];
}

function escapeCsv(value) {
  const string = String(value ?? '');
  const spreadsheetSafe = /^[\s]*[=+@-]/u.test(string) ? "'" + string : string;
  return '"' + spreadsheetSafe.replaceAll('"', '""') + '"';
}

function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function buildCsv(questions, values) {
  if (!questions.length || questions.length > 50) throw new Error('Enter between 1 and 50 distinct buyer questions.');
  if (!isCalendarDate(values.firstDate) || !isCalendarDate(values.repeatDate)
      || values.repeatDate <= values.firstDate) {
    throw new Error('Choose a repeat date after the first date.');
  }
  const required = ['engine', 'model', 'mode', 'country', 'language', 'brand'];
  if (required.some(field => !values[field]?.trim())) throw new Error('Fill in the brand and all required matching fields.');
  const rows = questions.flatMap(prompt => [values.firstDate, values.repeatDate].map(date => {
    const row = { ...values, date, prompt };
    return fieldNames.map(name => escapeCsv(row[name]?.trim())).join(',');
  }));
  return fieldNames.join(',') + '\r\n' + rows.join('\r\n') + '\r\n';
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('#audit-form');
  const { prompts, firstDate, repeatDate } = form.elements;
  const count = document.querySelector('#count');
  const feedback = document.querySelector('#feedback');
  const example = document.querySelector('#example');

  function updateCount() {
    const number = uniquePrompts(prompts.value).length;
    count.textContent = `${number} ${number === 1 ? 'question' : 'questions'} · ${number * 2} rows`;
    feedback.textContent = '';
  }

  function dateString(date) {
    return date.toISOString().slice(0, 10);
  }

  function loadExample() {
    const now = new Date();
    firstDate.value = dateString(now);
    repeatDate.value = dateString(new Date(now.getTime() + 7 * 86400000));
    prompts.value = 'Which accounting tools work well for small retailers?\nWhat bookkeeping software supports multiple locations?\nWhich tools help a small retail business reconcile daily sales?';
    for (const [name, value] of Object.entries({
      brand: 'Juniper Desk', engine: 'Example engine', model: 'Example model', mode: 'web', country: 'US', language: 'en', location: '',
    })) {
      form.elements.namedItem(name).value = value;
    }
    updateCount();
  }

  function downloadCsv(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(form));
    const questions = uniquePrompts(prompts.value);
    let csv;
    try {
      csv = buildCsv(questions, values);
    } catch (error) {
      feedback.dataset.error = 'true';
      feedback.textContent = error.message;
      return;
    }

    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'visibilityos-audit-plan.csv';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    feedback.dataset.error = 'false';
    feedback.textContent = `Downloaded ${questions.length * 2} rows for two audit rounds.`;
  }

  form.addEventListener('input', updateCount);
  form.addEventListener('submit', downloadCsv);
  example.addEventListener('click', loadExample);
  form.querySelector('button[type="submit"]').disabled = false;
}
