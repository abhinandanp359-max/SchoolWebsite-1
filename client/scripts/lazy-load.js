import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Replace <img ... > if it doesn't have fetchpriority or loading attributes
  content = content.replace(/<img\s+([^>]+)>/g, (match, attrs) => {
    if (attrs.includes('fetchpriority') || attrs.includes('loading="lazy"')) {
      return match;
    }
    changed = true;
    return `<img loading="lazy" decoding="async" ${attrs}>`;
  });

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Added lazy loading to ${file}`);
  }
});

console.log('Done.');
