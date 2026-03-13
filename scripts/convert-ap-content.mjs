import fs from 'fs';
import path from 'path';

function convertClass(classNumber) {
  const inputPath = path.join('src', 'content', 'ap-textbooks', `class-${classNumber}`, 'extracted.json');
  
  if (!fs.existsSync(inputPath)) {
    console.error(`No extracted data for Class ${classNumber}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  const outputDir = path.join('src', 'content', 'ap-textbooks', `class-${classNumber}`);

  // Separate by type
  const rhymes = [];
  const stories = [];
  const alphabetLessons = [];
  const exercises = [];
  const vocabulary = [];

  for (const chapter of data.chapters || []) {
    switch (chapter.type) {
      case 'rhyme':
        rhymes.push({
          id: chapter.id,
          title: chapter.title,
          lines: chapter.content?.lines || [],
          exercises: chapter.exercises || [],
        });
        break;
      case 'story':
      case 'comprehension':
        stories.push({
          id: chapter.id,
          title: chapter.title,
          paragraphs: chapter.content?.paragraphs || [],
          exercises: chapter.exercises || [],
        });
        break;
      case 'alphabet':
        alphabetLessons.push({
          id: chapter.id,
          title: chapter.title,
          letters: chapter.content?.letters || chapter.content?.lines || [],
          exercises: chapter.exercises || [],
        });
        break;
      case 'vocabulary':
        vocabulary.push(...(chapter.content?.vocabulary || []));
        break;
      default:
        // Mixed or other — extract exercises
        if (chapter.exercises?.length) {
          exercises.push(...chapter.exercises.map(ex => ({
            ...ex,
            sourceChapter: chapter.id,
            sourceTitle: chapter.title,
          })));
        }
        // If it has lines (could be a rhyme in mixed content)
        if (chapter.content?.lines?.length) {
          rhymes.push({
            id: chapter.id,
            title: chapter.title,
            lines: chapter.content.lines,
            exercises: chapter.exercises || [],
          });
        }
        break;
    }
  }

  // Write typed content files
  const writeTS = (filename, varName, data) => {
    const content = `// Auto-generated from AP SCERT Class ${classNumber} Telugu Textbook
// Source: https://cse.ap.gov.in
// DO NOT EDIT MANUALLY — re-run scripts/convert-ap-content.mjs to regenerate

export const ${varName} = ${JSON.stringify(data, null, 2)} as const;
`;
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, filename), content);
    console.log(`  ✅ ${filename} (${data.length} items)`);
  };

  console.log(`\n📖 Converting Class ${classNumber}:`);
  if (rhymes.length) writeTS('rhymes.ts', `AP_CLASS_${classNumber}_RHYMES`, rhymes);
  if (stories.length) writeTS('stories.ts', `AP_CLASS_${classNumber}_STORIES`, stories);
  if (alphabetLessons.length) writeTS('alphabet.ts', `AP_CLASS_${classNumber}_ALPHABET`, alphabetLessons);
  if (exercises.length) writeTS('exercises.ts', `AP_CLASS_${classNumber}_EXERCISES`, exercises);
  if (vocabulary.length) writeTS('vocabulary.ts', `AP_CLASS_${classNumber}_VOCABULARY`, vocabulary);
  
  // Write index file
  const indexContent = `// AP SCERT Class ${classNumber} Telugu Textbook — "${data.bookTitle?.te || ''}"
export const AP_CLASS_${classNumber}_META = ${JSON.stringify({
    class: classNumber,
    bookTitle: data.bookTitle,
    totalChapters: data.chapters?.length || 0,
    contentTypes: {
      rhymes: rhymes.length,
      stories: stories.length,
      alphabetLessons: alphabetLessons.length,
      exercises: exercises.length,
      vocabulary: vocabulary.length,
    },
  }, null, 2)};

${rhymes.length ? `export { AP_CLASS_${classNumber}_RHYMES } from './rhymes';` : ''}
${stories.length ? `export { AP_CLASS_${classNumber}_STORIES } from './stories';` : ''}
${alphabetLessons.length ? `export { AP_CLASS_${classNumber}_ALPHABET } from './alphabet';` : ''}
${exercises.length ? `export { AP_CLASS_${classNumber}_EXERCISES } from './exercises';` : ''}
${vocabulary.length ? `export { AP_CLASS_${classNumber}_VOCABULARY } from './vocabulary';` : ''}
`;
  fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent);
  console.log(`  ✅ index.ts`);
}

// Convert Class 1 and 2
[1, 2].forEach(convertClass);
console.log('\n✨ Conversion complete!');
