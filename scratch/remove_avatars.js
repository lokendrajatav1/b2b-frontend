const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
};

walk('c:\\React\\B2B\\b2b-frontend\\src\\app\\(dashboard)', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Pattern to find the avatar boxes in tables: 
    // <div className="w-12 h-12 bg-gray-50 ..."> { ... ? <img ... /> : ... } </div>
    // It's usually inside <div className="flex items-center gap-4">
    const avatarRegex = /<div className="w-\d+\s+h-\d+\s+bg-gray-50[^>]*>[\s\S]*?<\/div>/g;
    
    // We only want to remove it if it's right before <div className="flex flex-col"> which contains the name
    content = content.replace(/(<div className="flex items-center gap-\d+[^"]*">)\s*<div className="w-\d+\s+h-\d+\s+bg-(?:gray|emerald|amber)-50[^>]*>[\s\S]*?<\/div>\s*(<div className="flex flex-col">)/g, "$1\n$2");
    
    // Also handle ones without <div className="flex flex-col"> immediately after
    content = content.replace(/(<div className="flex items-center gap-\d+[^"]*">)\s*<div className="w-\d+\s+h-\d+\s+(?:bg-gray-50|bg-emerald-50)[^>]*>[\s\S]*?<\/div>\s*(<div)/g, "$1\n$2");

    // Also handle one where it's next to <span> directly
    content = content.replace(/(<div className="flex items-center gap-\d+[^"]*">)\s*<div className="w-\d+\s+h-\d+\s+bg-(?:gray|emerald|amber)-50[^>]*>[\s\S]*?<\/div>\s*(<span|<p|<h)/g, "$1\n$2");

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Removed avatars from ${filePath}`);
    }
  }
});
