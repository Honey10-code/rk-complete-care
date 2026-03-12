import fs from 'fs';
import path from 'path';

const directory = './src';

const replacements = [
    { regex: /#3d7a8a/gi, replacement: '#0d9488' }, // Teal 600
    { regex: /#2a5f6e/gi, replacement: '#0f766e' }, // Teal 700
    { regex: /#6aabbf/gi, replacement: '#2dd4bf' }, // Teal 400
    { regex: /#a07850/gi, replacement: '#d97706' }, // Amber 600
    { regex: /#c4a882/gi, replacement: '#f59e0b' }, // Amber 500
    { regex: /#1e3240/gi, replacement: '#0f172a' }, // Slate 900
    { regex: /rgba\(61,\s*122,\s*138/gi, replacement: 'rgba(13, 148, 136' },
    { regex: /rgba\(160,\s*120,\s*80/gi, replacement: 'rgba(217, 119, 6' },
    { regex: /rgba\(106,\s*171,\s*191/gi, replacement: 'rgba(45, 212, 191' },
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            for (const { regex, replacement } of replacements) {
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    modified = true;
                }
            }
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(directory);
console.log('Replacement complete.');
