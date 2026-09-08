export function cleanFrontmatter(input: string) {
  const lines = input.split('\n');
  if (lines.length < 1 || !lines[0]!.startsWith('---')) {
    return input;
  }

  let count = 0;
  return lines
    .map((line) => {
      if (count < 2 && line.startsWith('---')) {
        count++;
        return line.trimEnd();
      }
      return line;
    })
    .join('\n');
}
