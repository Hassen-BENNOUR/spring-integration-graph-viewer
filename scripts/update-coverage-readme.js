#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// 1. Charger le résumé JSON
const summaryPath = path.join(__dirname, '../coverage/coverage.txt');
if (!fs.existsSync(summaryPath)) {
    console.error('❌ coverage.txt introuvable');
    process.exit(1);
}
// let {total} = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
// // 2. Construire une table Markdown
// const headers = ['Statements', 'Branches', 'Functions', 'Lines'];
// const row = headers.map(key => {
//     const metric = key.toLowerCase();
//     return `${total[metric].pct}%`;
// });
// const table = [
//     `| ${headers.join(' | ')} |`,
//     `| ${headers.map(() => '---').join(' | ')} |`,
//     `| ${row.join(' | ')} |`
// ].join('\n');

let table = fs.readFileSync(summaryPath, 'utf8');

// 3. Injecter dans le README entre des marqueurs
const readmePath = path.join(__dirname, '../README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
const newReadme = readme.replace(
    /<!-- coverage start -->([\s\S]*?)<!-- coverage end -->/,
    `<!-- coverage start -->\n${table}\n<!-- coverage end -->`
);
fs.writeFileSync(readmePath, newReadme);
console.log('✅ README.md mis à jour avec le coverage summary');
