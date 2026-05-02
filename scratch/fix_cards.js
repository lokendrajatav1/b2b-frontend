const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

const regex = /(bg-white|bg-gray-50|bg-\[\#fff7ed\]|bg-emerald-50)[\s\w-\[\]\/]*(rounded-(xl|2xl|3xl|lg|md|\[2\.5rem\]))/g;

walk('c:\\React\\B2B\\b2b-frontend\\src\\app\\(dashboard)', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // We only want to replace the `rounded-*` part inside strings that look like card classes
    // e.g. "bg-white p-6 rounded-2xl" -> "bg-white p-6 rounded-none"
    
    // A safer way is to replace rounded-* with rounded-none when it's in the same className string as bg-white etc.
    // Let's do it by finding className="..." and if it contains bg-white, replace rounded-* with rounded-none.
    
    content = content.replace(/className=(["`'])(.*?)\1/g, (match, quote, inner) => {
      if (inner.includes('bg-white') || inner.includes('bg-gray-50') || inner.includes('bg-[#fff7ed]') || inner.includes('bg-emerald-50') || inner.includes('bg-[#007367]') || inner.includes('bg-[#f37021]')) {
        // If it's a card/container, it usually has padding 'p-' and border
        if (inner.includes('border') || inner.includes('shadow') || inner.includes('p-')) {
          return `className=${quote}${inner.replace(/rounded-(xl|2xl|3xl|lg|md|sm|\[.*?\])/g, 'rounded-none')}${quote}`;
        }
      }
      return match;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated cards in ${filePath}`);
    }
  }
});
