function findMajorityAffix(total: number, group: string[][]): string[] {
  const affix: string[] = [];
  while (true) {
    const i = affix.length;
    const counts = new Map<string, number>();
    group.filter((w) => w.length > i + 1).forEach((w) => counts.set(w[i]!, (counts.get(w[i]!) ?? 0) + 1));

    const best = [...counts.entries()].reduce<[string, number] | null>((a, b) => (a && a[1] >= b[1] ? a : b), null);
    if (!best || best[1] * 2 <= total) {
      return affix;
    }

    const [word] = best;
    affix.push(word);
    group = group.filter((w) => w.length > i + 1 && w[i] === word);
  }
}

function startsWith(words: string[], affix: string[]): boolean {
  return affix.every((a, i) => words[i] === a);
}

function endsWith(words: string[], affix: string[]): boolean {
  return affix.length <= words.length && affix.every((a, i) => words[words.length - affix.length + i] === a);
}

function inferTabNames(names: string[]): string[] {
  if (names.length < 2) {
    return names;
  }

  const words = names.map((n) => n.split(/\s+/).filter((w) => w.length > 0));
  const prefix = findMajorityAffix(names.length, words);
  const suffix = findMajorityAffix(
    names.length,
    words.map((w) => [...w].reverse())
  ).reverse();

  return names.map((name, idx) => {
    const word = words[idx]!;
    const start = startsWith(word, prefix) ? prefix.length : 0;
    const rest = word.slice(start);
    const end = endsWith(rest, suffix) ? rest.length - suffix.length : rest.length;
    return end === 0 ? name : rest.slice(0, end).join(' ');
  });
}

export default {
  inferTabNames
};
