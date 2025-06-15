function highlightParts(text: string) {
  const quoteRegex = /(['"`])((?:\\\1|.)*?)\1/g;
  const urlRegex = /(https?:\/\/[^\s"'`]+)/g;

  const parts = [];
  let lastIndex = 0;
  // @ts-ignore
  text.replace(new RegExp(`${quoteRegex.source}|${urlRegex.source}`, 'g'), (match, quote, content, url, index) => {
    parts.push(text.slice(lastIndex, index));

    if (url) {
      parts.push(
        <span key={index} style={{color: "#A5D6FF"}}>
          {url}
        </span>
      );
    } else {
      parts.push(
        <span key={index} style={{color: "#A5D6FF"}}>
          {quote}{content}{quote}
        </span>
      );
    }

    lastIndex = index + match.length;
  });
  parts.push(text.slice(lastIndex));

  return parts;
}

function colorLine(line: string, color: string) {
  return (
    <span>
      <span className={color}>{line.substring(0, 3)}</span>
      <span>{line.substring(3, 5)}</span>
      <span className="text-[#8B949E]">{line.substring(5, 24)}</span>
      {...highlightParts(line.substring(24))}
    </span>
  )
}

function highlightLine(line: string) {
  const level = line.charAt(1);
  if (level === 'C') {
    return colorLine(line, 'text-neutral-200 bg-red-400');
  }
  else if (level === 'E') {
    return colorLine(line, 'text-red-400');
  } else if (level === 'I') {
    return colorLine(line, 'text-[#7EE787]');
  } else if (level === 'W') {
    return colorLine(line, 'text-warning');
  } else if (level === 'D') {
    return colorLine(line, '');
  } else if (level === 'T') {
    return (
      <span className="opacity-60">
        {line}
      </span>
    );
  }
  return <span>{line}</span>
}

export default {
  highlightLine
}