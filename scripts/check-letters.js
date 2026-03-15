const fs = require('fs');
const glob = require('glob');

const teluguAlphabet = {
  vowels: ["అ", "ఆ", "ఇ", "ఈ", "ఉ", "ఊ", "ఋ", "ౠ", "ఎ", "ఏ", "ఐ", "ఒ", "ఓ", "ఔ", "అం", "అః"],
  consonants: ["క", "ఖ", "గ", "ఘ", "ఙ", "చ", "ఛ", "జ", "ఝ", "ఞ", "ట", "ఠ", "డ", "ఢ", "ణ", "త", "థ", "ద", "ధ", "న", "ప", "ఫ", "బ", "భ", "మ", "య", "ర", "ల", "వ", "శ", "ష", "స", "హ", "ళ", "క్ష", "ఱ"]
};

function checkCoverage() {
  const files = fs.readdirSync('src/content/digital-book').filter(f => f.startsWith('chapter-') && f.endsWith('.ts'));
  const foundLetters = new Set();
  
  for (const file of files) {
    const content = fs.readFileSync(`src/content/digital-book/${file}`, 'utf8');
    // Basic regex to find letters in the chapter definitions
    const letterMatches = content.match(/letter:\s*["']([^"']+)["']/g);
    if (letterMatches) {
      letterMatches.forEach(match => {
        const letter = match.replace(/letter:\s*["']([^"']+)["']/, '$1').trim();
        foundLetters.add(letter);
      });
    }
  }

  console.log("Total chapters parsed:", files.length);
  const covered = Array.from(foundLetters);
  console.log("Letters covered:", covered.join(", "));

  const missingVowels = teluguAlphabet.vowels.filter(l => !foundLetters.has(l));
  const missingConsonants = teluguAlphabet.consonants.filter(l => !foundLetters.has(l));

  console.log("\nMissing Vowels:", missingVowels.join(", ") || "None!");
  console.log("Missing Consonants:", missingConsonants.join(", ") || "None!");

}

checkCoverage();
