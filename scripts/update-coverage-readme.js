#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const summaryPath = path.join(__dirname, '../coverage/spring-integration-graph-viewer/coverage-summary.json');
const readmePath  = path.join(__dirname, '../README.md');
const summary     = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

const total   = summary.total;
const headers = ['Statements','Branches','Functions','Lines'];
const rows = headers.map(key => {
    const m   = key.toLowerCase();
    const pct = total[m].pct.toFixed(2);
    const label = encodeURIComponent(key);
    const value = encodeURIComponent(pct + '%');
    const url   = `https://img.shields.io/badge/${label}-${value}-yellow`;
    return `![${key} coverage](${url})`; // ou adapte "Total" / nom de fichier
});

const tableMd = [...rows].join('\n');

let readme = fs.readFileSync(readmePath, 'utf8');
readme = readme.replace(
    /<!-- coverage start -->[\s\S]*?<!-- coverage end -->/,
    `<!-- coverage start -->\n${tableMd}\n<!-- coverage end -->`
);
fs.writeFileSync(readmePath, readme);
console.log('✅ README.md mis à jour');
