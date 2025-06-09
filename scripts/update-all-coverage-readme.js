#!/usr/bin/env node
const fs = require('fs');
const path = require('path');


// 1) Chemin vers le résumé JSON produit par Karma
const summaryPath = path.join(__dirname, '../coverage/spring-integration-graph-viewer/coverage-summary.json');
if (!fs.existsSync(summaryPath)) {
    console.error('❌ coverage-summary.json introuvable à', summaryPath);
    process.exit(1);
}


const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

// 2) Construire les en-têtes du tableau Markdown
const metrics = ['statements','branches','functions','lines'];
const headers = ['File', ...metrics.map(m => m.charAt(0).toUpperCase() + m.slice(1))];
const headerLine    = `| ${headers.join(' | ')} |`;
const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`;

// 3) Générer une ligne par entrée (total + chaque fichier)
const rows = Object.keys(summary)
    .filter(key => summary[key].lines)  // nœuds sans coverage.lines sont ignorés
    .map(key => {
        const data = summary[key];
        const file = key === 'total' ? 'Total' : key.replace(/\\\\/g, '/');
        const vals = metrics.map(m => data[m]?.pct != null ? data[m].pct + '%' : '-');
        return `| ${file} | ${vals.join(' | ')} |`;
    });

// 4) Trier pour avoir “Total” en premier
rows.sort((a,b) => {
    if (a.startsWith('| Total')) return -1;
    if (b.startsWith('| Total')) return  1;
    return a.localeCompare(b);
});

// 5) Concaténer le Markdown final
const tableMd = [headerLine, separatorLine, ...rows].join('<br /> ');

// 6) Injecter dans le README.md entre les marqueurs
const readmePath = path.join(__dirname, '../README.md');
let readme = fs.readFileSync(readmePath, 'utf8');
const start = '<!-- coverage start -->';
const end   = '<!-- coverage end -->';
const regex = new RegExp(`${start}[\\s\\S]*?${end}`, 'm');
if (!regex.test(readme)) {
    console.error('❌ Marqueurs coverage absents dans README.md');
    process.exit(1);
}
const replacement = `${start}<br /> ${tableMd}<br /> ${end}`;
readme = readme.replace(regex, replacement);
fs.writeFileSync(readmePath, readme);

console.log('✅ README.md mis à jour avec le coverage détaillé');

// ![Coverage](https://img.shields.io/badge/coverage-65.47%25-yellow)
