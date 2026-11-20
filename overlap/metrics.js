export const comparisons = 817;
const brandChanges = 82;
const linkChanges = 79;

export const minOverlap = Math.max(0, brandChanges + linkChanges - comparisons);
export const maxOverlap = Math.min(brandChanges, linkChanges);

export function countsForOverlap(both) {
  if (!Number.isInteger(both) || both < minOverlap || both > maxOverlap) {
    throw new RangeError('Overlap must be a whole count in the possible range.');
  }

  const either = brandChanges + linkChanges - both;
  return {
    both,
    brandOnly: brandChanges - both,
    linkOnly: linkChanges - both,
    neither: comparisons - either,
    either,
  };
}
