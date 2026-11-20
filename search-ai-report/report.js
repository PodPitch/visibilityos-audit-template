const googleMetrics = [
  ['impressions', 'Web impressions', 240, 300],
  ['clicks', 'Web clicks', 12, 9],
  ['aiImpressions', 'Generative AI impressions', 30, 45],
];
const auditMetrics = [
  ['checks', 'Completed checks', 40, 40],
  ['mentions', 'Checks naming the brand', 8, 6],
  ['links', 'Checks linking to the official site', 5, 4],
];
const form = document.getElementById('report-form');
const report = document.getElementById('report');
const tables = document.getElementById('result-tables');
const exampleNote = document.getElementById('example-note');
const announcement = document.getElementById('announcement');
const periods = ['Earlier', 'Later'];
const countFormat = new Intl.NumberFormat('en-US');
const signedCount = new Intl.NumberFormat('en-US', {signDisplay: 'exceptZero'});
const signedPercent = new Intl.NumberFormat('en-US', {
  signDisplay: 'exceptZero', minimumFractionDigits: 1, maximumFractionDigits: 1,
});

function addFields(id, metrics) {
  const fieldset = document.getElementById(id);
  fieldset.insertAdjacentHTML('beforeend', '<div class="field-row period-label" aria-hidden="true"><span></span><span>Earlier</span><span>Later</span></div>');
  for (const [key, label] of metrics) {
    const optional = key === 'aiImpressions';
    const cells = periods.map(period => (
      `<input type="number" min="${key === 'checks' ? '1' : '0'}" max="1000000000" step="1" inputmode="numeric" name="${key}${period}" aria-label="${label}, ${period.toLowerCase()} period${optional ? ', optional' : ''}" ${optional ? '' : 'required'}>`
    ));
    fieldset.insertAdjacentHTML('beforeend', `<div class="field-row"><span>${label}${optional ? ' (optional)' : ''}</span>${cells.join('')}</div>`);
  }
}

function readPair(key) {
  return periods.map(period => {
    const value = form.elements.namedItem(`${key}${period}`).value;
    return value === '' ? null : Number(value);
  });
}

function printedChange(earlier, later) {
  const delta = later - earlier;
  const relative = earlier === 0 ? '' : ` <span class="relative">(${signedPercent.format(100 * delta / earlier)}%)</span>`;
  return `${signedCount.format(delta)}${relative}`;
}

function countRow(label, pair) {
  const [earlier, later] = pair;
  return [label, countFormat.format(earlier), countFormat.format(later), printedChange(earlier, later)];
}

function rateRow(label, pair, checks) {
  const [earlier, later] = pair.map((value, index) => 100 * value / checks[index]);
  return [label, `${earlier.toFixed(1)}%`, `${later.toFixed(1)}%`, `${signedPercent.format(later - earlier)} pp`];
}

function reportTable(title, rows) {
  const body = rows.map(([label, earlier, later, delta]) => (
    `<tr><th scope="row">${label}</th><td>${earlier}</td><td>${later}</td><td>${delta}</td></tr>`
  )).join('');
  return `<section class="metric-panel"><h3>${title}</h3><table aria-label="${title} results"><thead><tr><th scope="col">Metric</th><th scope="col">Earlier</th><th scope="col">Later</th><th scope="col">Change</th></tr></thead><tbody>${body}</tbody></table></section>`;
}

function compare(isExample = false) {
  const checks = readPair('checks');
  const mentions = readPair('mentions');
  const links = readPair('links');
  const aiImpressions = readPair('aiImpressions');
  for (const [index, period] of periods.entries()) {
    for (const [metric, value] of [['mentions', mentions[index]], ['links', links[index]]]) {
      if (value > checks[index]) {
        form.elements.namedItem(`${metric}${period}`).setCustomValidity('This count cannot exceed completed checks.');
      }
    }
    if (aiImpressions[index] === null && aiImpressions[1 - index] !== null) {
      form.elements.namedItem(`aiImpressions${period}`).setCustomValidity('Enter both period counts for this optional row, or leave both blank.');
    }
  }
  if (!form.reportValidity()) return;

  const googleRows = googleMetrics.slice(0, 2).map(([key, label]) => countRow(label, readPair(key)));
  if (aiImpressions[0] !== null) googleRows.push(countRow('Generative AI impressions', aiImpressions));
  const auditRows = [
    countRow('Completed checks', checks),
    rateRow('Name-mention rate', mentions, checks),
    rateRow('Official-link rate', links, checks),
  ];
  tables.innerHTML = reportTable('Google Search Console', googleRows) + reportTable('AI answer audit', auditRows);
  report.hidden = false;
  exampleNote.hidden = !isExample;
  announcement.textContent = 'Comparison ready. Changes in the AI audit rates are in percentage points.';
}

function clearReport() {
  for (const input of form.querySelectorAll('input')) input.setCustomValidity('');
  report.hidden = true;
  announcement.textContent = '';
}

addFields('google-fields', googleMetrics);
addFields('audit-fields', auditMetrics);
form.addEventListener('input', clearReport);
form.addEventListener('reset', clearReport);
form.addEventListener('submit', event => {
  event.preventDefault();
  compare();
});
document.getElementById('sample').addEventListener('click', () => {
  clearReport();
  for (const [key, , earlier, later] of [...googleMetrics, ...auditMetrics]) {
    form.elements.namedItem(`${key}Earlier`).value = earlier;
    form.elements.namedItem(`${key}Later`).value = later;
  }
  compare(true);
});
