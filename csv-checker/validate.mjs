const matchFields = ['prompt', 'engine', 'model', 'mode', 'country', 'language', 'location', 'brand'];
const required = ['date', ...matchFields, 'mentioned', 'linked'];
const maxBytes = 5 * 1024 * 1024;

export const sizeLimit = maxBytes;

function parseCsv(text) {
  const rows = [];
  let cells = [];
  let cell = '';
  let state = 'start';
  let line = 1;
  let startLine = 1;

  function finishRow() {
    cells.push(cell);
    if (cells.length > 1 || cells[0].trim()) rows.push({ cells, line: startLine });
    cells = [];
    cell = '';
    state = 'start';
  }

  for (let i = text.charCodeAt(0) === 0xfeff ? 1 : 0; i < text.length; i += 1) {
    const char = text[i];
    const isNewline = char === '\r' || char === '\n';
    if (state === 'quoted') {
      if (char === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          state = 'closed';
        }
      } else {
        if (isNewline && (char !== '\n' || text[i - 1] !== '\r')) line += 1;
        cell += char;
      }
    } else if (isNewline) {
      finishRow();
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      line += 1;
      startLine = line;
    } else if (char === ',') {
      cells.push(cell);
      cell = '';
      state = 'start';
    } else if (state === 'start' && char === '"') {
      state = 'quoted';
    } else if (char === '"' || state === 'closed') {
      throw new Error(`Line ${line}: check the placement of quotation marks.`);
    } else {
      state = 'plain';
      cell += char;
    }
  }

  if (state === 'quoted') throw new Error(`Line ${startLine}: close the quoted CSV field.`);
  finishRow();
  return rows;
}

function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000')) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().startsWith(value);
}

export function checkCsv(text) {
  if (new Blob([text]).size > sizeLimit) throw new Error('Choose a CSV under 5 MB.');
  const [header, ...rows] = parseCsv(text);
  if (!header) throw new Error('Choose a CSV file or paste the CSV first.');
  if (new Set(header.cells).size !== header.cells.length) throw new Error('Each column heading must be unique.');
  const missing = required.filter((name) => !header.cells.includes(name));
  if (missing.length) throw new Error(`Missing column${missing.length === 1 ? '' : 's'}: ${missing.join(', ')}.`);

  const observations = new Map();
  const issues = [];
  let valid = 0;
  for (const { cells, line } of rows) {
    if (cells.length !== header.cells.length) {
      issues.push(`Line ${line}: this row has a different number of values from the header.`);
      continue;
    }

    const row = Object.fromEntries(header.cells.map((name, index) => [name, cells[index]]));
    const conditions = matchFields.map((name) => row[name].trim());
    const blanks = matchFields.filter((name, index) => name !== 'location' && !conditions[index]);
    const problems = [];
    if (!isCalendarDate(row.date)) problems.push('use a real date in YYYY-MM-DD format');
    if (blanks.length) problems.push(`fill in ${blanks.join(', ')}`);
    if (![row.mentioned, row.linked].every((flag) => flag === 'yes' || flag === 'no')) {
      problems.push('use yes or no for mentioned and linked');
    }
    if (problems.length) {
      issues.push(`Line ${line}: ${problems.join('. ')}.`);
      continue;
    }

    const key = JSON.stringify(conditions);
    if (!observations.has(key)) observations.set(key, new Map());
    const dates = observations.get(key);
    if (dates.has(row.date)) {
      issues.push(`Line ${line}: duplicates the question, settings, and date on line ${dates.get(row.date)}.`);
      continue;
    }
    dates.set(row.date, line);
    valid += 1;
  }

  let matched = 0;
  let unpaired = 0;
  for (const dates of observations.values()) {
    if (dates.size === 1) unpaired += 1;
    matched += dates.size - 1;
  }
  return { valid, matched, unpaired, issues, total: rows.length };
}
