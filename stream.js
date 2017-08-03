// issues:
// 1) ignore common gitignored files?
// 2) just search by author handle
// 3) just git log back to last date of GitHub events
//
const yaml = require('js-yaml');
const fs   = require('fs');

const doc = yaml.safeLoad(fs.readFileSync('/Users/binarymason/code/clt/gitrospection/config/languages.yml', 'utf8'));

const hasExtension = (obj, filename) => {
  const extensions = obj.extensions;
  if (!extensions) return false;

  const extension = `.${filename.split('.').pop()}`;

  return extensions.includes(extension);
};

const hasFileName = (obj, filename) => {
  const filenames = obj.filenames;
  if (!filenames) return false;

  return filenames.includes(filename);
};

const findLanguage = filename => (
  Object.keys(doc).find((k) => {
    const obj = doc[k];
    return hasFileName(obj, filename) || hasExtension(obj, filename);
  })
);


const stats = {};
const parseStats = lines => (
  lines.forEach((l) => {
    const diff = l.split('\t');
    const path = diff[diff.length - 1];
    const file = path.split('/').pop();

    const lang = findLanguage(file);

    // ignore languages not in config/languages.yml
    if (!lang) return true;

    const added = Number(diff[0]);
    const removed = Number(diff[1]);

    stats[lang] = stats[lang] || {};
    stats[lang].added = stats[lang].added || 0;
    stats[lang].removed = stats[lang].removed || 0;

    stats[lang] = {
      added: stats[lang].added += added,
      removed: stats[lang].removed += removed,
    };
  })
);

const handleSTDIN = () => {
  const buf = process.stdin.read();
  if (!buf) return;

  const str = buf.toString().trim();
  const lines = str.split('\n');

  parseStats(lines);
};


process.stdin
  .on('readable', handleSTDIN)
  .on('end', () => { console.dir(stats) });
