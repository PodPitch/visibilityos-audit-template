const presence = new Set(['mention', 'link', 'both']);
const links = new Set(['link', 'both']);

export function countChanges(rows) {
  const result = { comparisons: 0, presenceChanges: 0, linkChanges: 0 };
  for (const [prompt, before, after] of rows) {
    if (!prompt.trim() || !before || !after) continue;
    result.comparisons += 1;
    result.presenceChanges += presence.has(before) !== presence.has(after);
    result.linkChanges += links.has(before) !== links.has(after);
  }
  return result;
}
