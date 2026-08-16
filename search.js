const fs = require('fs');
const path = require('path');

const searchTerms = ['ERATECH', 'THANHTDH'];
const excludeDirs = ['node_modules', '.next', '.git', 'dist'];
const exts = ['.js', '.jsx', '.json'];

function searchFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                results = results.concat(searchFiles(fullPath));
            }
        } else {
            if (exts.includes(path.extname(fullPath))) {
                const content = fs.readFileSync(fullPath, 'utf8');
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                    searchTerms.forEach(term => {
                        if (line.toUpperCase().includes(term)) {
                            results.push(`${fullPath}:${index + 1}: ${line.trim()}`);
                        }
                    });
                });
            }
        }
    });
    return results;
}

const res = searchFiles('.');
res.forEach(r => console.log(r));
