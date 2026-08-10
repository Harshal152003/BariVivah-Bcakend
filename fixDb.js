const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walkDir('c:/Users/Admin/Documents/barivivah_backend/src/app/api');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  content = content.replace(/import connectDB from ["']@\/lib\/db["'];?/g, 'import connectDB from "@/lib/dbConnect";');
  content = content.replace(/import dbConnect from ["']@\/lib\/db["'];?/g, 'import dbConnect from "@/lib/dbConnect";');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated db import in', file);
  }
});
