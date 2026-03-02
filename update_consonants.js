const fs = require('fs');
const content = fs.readFileSync('src/content/consonants.ts', 'utf8');
const updated = content.replace(/({ id: "([^"]+)", [^}]+)(})/g, (match, prefix, id, suffix) => {
    // only add if not already there
    if (prefix.includes('imageUrl')) return match;
    return `${prefix}, imageUrl: "/images/anchors/${id}.png" }`;
});
fs.writeFileSync('src/content/consonants.ts', updated);
console.log('Updated consonants.ts');
