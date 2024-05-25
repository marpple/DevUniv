const escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '`': '&#x60;',
};
const unescapeMap = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#x27;': "'",
  '&#x60;': '`',
};

function createEscaper(map: Record<string, string>) {
  function escaper(match: string) {
    return map[match];
  }
  const source = '(?:' + Object.keys(map).join('|') + ')';
  const testRegexp = RegExp(source);
  const replaceRegexp = RegExp(source, 'g');

  return function (string: unknown) {
    const string2 = `${string}`;
    return testRegexp.test(string2) ? string2.replace(replaceRegexp, escaper) : string2;
  };
}

const escapeHtml = createEscaper(escapeMap);
const unescapeHtml = createEscaper(unescapeMap);

export { escapeHtml, unescapeHtml };
