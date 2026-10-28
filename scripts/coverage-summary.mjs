// Writes the Vitest coverage totals as a Markdown table (for the GitHub job summary).
import { readFileSync } from 'node:fs';

const { total } = JSON.parse(readFileSync('coverage/coverage-summary.json', 'utf8'));
const rows = ['lines', 'statements', 'functions', 'branches'].map(
  (k) => `| ${k[0].toUpperCase()}${k.slice(1)} | ${total[k].pct}% | ${total[k].covered} / ${total[k].total} |`
);
console.log(['### Unit test coverage', '', '| Metric | Coverage | Covered |', '| --- | --- | --- |', ...rows].join('\n'));
