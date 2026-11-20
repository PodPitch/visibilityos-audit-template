const maxCount = 1_000_000;

export function calculatePeriod({ answers, brand, competitors }) {
  if (![answers, brand, competitors].every(count =>
    Number.isInteger(count) && count >= 0 && count <= maxCount
  )) {
    return { error: 'Enter whole numbers from 0 to 1,000,000.' };
  }
  if (brand > answers) {
    return { error: 'Answers naming your brand cannot exceed completed answers.' };
  }
  if (answers === 0 && competitors > 0) {
    return { error: 'Other tracked-brand mentions require at least one completed answer.' };
  }

  const mentions = brand + competitors;
  return {
    rate: answers ? (100 * brand) / answers : null,
    share: mentions ? (100 * brand) / mentions : null,
  };
}

export function difference(before, after) {
  return before === null || after === null ? null : after - before;
}
