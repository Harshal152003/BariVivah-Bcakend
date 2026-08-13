const fs = require('fs');
const file = 'src/app/login/page.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-gradient-to-r from-secondary to-primary/g, 'bg-[#FB2467]');
// Replace button backgrounds
content = content.replace(/bg-primary/g, 'bg-[#FB2467]');
// Also fix text-primary in case that was the issue for text not showing!
content = content.replace(/text-primary/g, 'text-[#FB2467]');
// And border-primary
content = content.replace(/border-primary/g, 'border-[#FB2467]');

fs.writeFileSync(file, content);
console.log('Replaced colors successfully!');
