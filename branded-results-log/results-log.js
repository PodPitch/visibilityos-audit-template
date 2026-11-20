'use strict';

const columns = [
  ['date', 'Check date'], ['time', 'Local check time'], ['enteredQuery', 'Entered query'],
  ['displayedQuery', 'Query shown by Google'], ['market', 'Search location'], ['device', 'Device'],
  ['homepage', 'Official homepage'], ['position', 'Homepage position on page one'],
  ['confirmed', 'Confirmed results on page one'], ['notes', 'Notes'],
];

function formatCsvField(value) {
  const text = String(value);
  const safe = /^[\r\n\t]|^\s*[=+@-]/u.test(text) ? "'" + text : text;
  return '"' + safe.replace(/"/g, '""') + '"';
}

function toCsv(records) {
  const rows = [columns.map(([, label]) => label), ...records.map(record =>
    columns.map(([key]) => record[key]))];
  return rows.map(cells => cells.map(formatCsvField).join(',')).join('\r\n') + '\r\n';
}

const form = document.querySelector('#results-form');
const entries = document.querySelector('#entries');
const entryCount = document.querySelector('#entry-count');
const feedback = document.querySelector('#feedback');
const download = document.querySelector('#download');
const records = [];
let nextId = 1;

function renderLog() {
  entries.replaceChildren();
  entryCount.textContent = records.length
    ? records.length + (records.length === 1 ? ' recorded search' : ' recorded searches')
    : 'Add a search to start your log.';
  download.disabled = !records.length;

  for (const record of records) {
    const item = document.createElement('li');
    const summary = document.createElement('div');
    const headline = document.createElement('h3');
    headline.textContent = record.displayedQuery;
    const details = document.createElement('p');
    const location = [record.date, record.time, record.market, record.device].filter(Boolean).join(' · ');
    details.textContent = location;
    const counts = document.createElement('p');
    const rank = record.position ? 'Homepage #' + record.position : 'Homepage absent from page one';
    counts.textContent = rank + ' · ' + record.confirmed + ' confirmed ' + (record.confirmed === '1' ? 'result' : 'results');
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', 'Remove ' + record.displayedQuery + ' check from ' + record.date);
    remove.addEventListener('click', () => {
      records.splice(records.findIndex(entry => entry.id === record.id), 1);
      renderLog();
      feedback.textContent = 'Removed the search from the log.';
      document.querySelector('#log-heading').focus();
    });
    summary.append(headline, details, counts);
    if (record.enteredQuery !== record.displayedQuery) {
      const originalQuery = document.createElement('p');
      originalQuery.textContent = 'You entered ' + record.enteredQuery;
      summary.append(originalQuery);
    }
    if (record.notes) {
      const note = document.createElement('p');
      note.textContent = record.notes;
      summary.append(note);
    }
    item.append(summary, remove);
    entries.append(item);
  }
}

form.addEventListener('input', () => { feedback.textContent = ''; });
form.addEventListener('submit', event => {
  event.preventDefault();
  const record = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, value.trim()]));
  if (!record.enteredQuery || !record.market) {
    feedback.textContent = 'Enter a query and search location.';
    return;
  }
  if (!/^https?:\/\//i.test(record.homepage)) {
    feedback.textContent = 'Enter a homepage beginning with https:// or http://.';
    form.elements.homepage.focus();
    return;
  }
  if (record.position && Number(record.confirmed) === 0) {
    feedback.textContent = 'A homepage listed on page one counts as one confirmed result.';
    form.elements.confirmed.focus();
    return;
  }
  record.displayedQuery ||= record.enteredQuery;
  records.push({ ...record, id: nextId++ });
  renderLog();
  form.elements.position.value = '';
  form.elements.confirmed.value = '';
  form.elements.notes.value = '';
  feedback.textContent = 'Saved this search in the log. Update the fields before adding another.';
});

document.querySelector('#example').addEventListener('click', () => {
  const example = {
    enteredQuery: 'northlake metrics', displayedQuery: '', date: '2026-11-19', time: '09:30',
    market: 'United States', device: 'Desktop', homepage: 'https://northlake.example/',
    position: '2', confirmed: '3', notes: 'Fictional example. Two verified listings appeared below the homepage.',
  };
  for (const [name, value] of Object.entries(example)) form.elements.namedItem(name).value = value;
  feedback.textContent = 'Fictional example loaded. Select Add to log to record it.';
});

download.addEventListener('click', () => {
  const file = new Blob(['\ufeff', toCsv(records)], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'visibilityos-branded-search.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
