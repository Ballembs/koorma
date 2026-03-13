#!/usr/bin/env node
/**
 * Upload book-pages to Supabase Storage
 * 
 * Usage: node scripts/upload-book-pages.mjs
 * 
 * This script uploads all book page images from public/book-pages/ 
 * to a Supabase Storage bucket named "book-pages".
 * 
 * Prerequisites:
 * - SUPABASE_SERVICE_ROLE_KEY env var must be set (use the service role key, not anon/publishable)
 * - The bucket "book-pages" should exist (the script will try to create it as public)
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://deuekxrcicpawkcqcrpl.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Set SUPABASE_SERVICE_ROLE_KEY env var (from Supabase dashboard → Settings → API → service_role key)');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const BUCKET = 'book-pages';
const BOOK_PAGES_DIR = path.join(__dirname, '..', 'public', 'book-pages');

async function ensureBucket() {
  // Try to create the bucket (will fail silently if it already exists)
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10_000_000, // 10MB max per file
  });
  if (error && !error.message.includes('already exists')) {
    console.error('❌ Failed to create bucket:', error.message);
    process.exit(1);
  }
  console.log(`✅ Bucket "${BUCKET}" ready`);
}

async function uploadFile(localPath, storagePath) {
  const fileBuffer = fs.readFileSync(localPath);
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: 'image/png',
      upsert: true,
    });
  if (error) {
    console.error(`  ❌ Failed: ${storagePath} — ${error.message}`);
    return false;
  }
  return true;
}

async function main() {
  await ensureBucket();

  // Find all class directories
  const classDirs = fs.readdirSync(BOOK_PAGES_DIR)
    .filter(d => d.startsWith('class-') && fs.statSync(path.join(BOOK_PAGES_DIR, d)).isDirectory())
    .sort();

  let total = 0;
  let uploaded = 0;
  let skipped = 0;

  for (const classDir of classDirs) {
    const classPath = path.join(BOOK_PAGES_DIR, classDir);
    const files = fs.readdirSync(classPath)
      .filter(f => f.endsWith('.png'))
      .sort();
    
    console.log(`\n📚 ${classDir}: ${files.length} pages`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      total++;
      const localPath = path.join(classPath, file);
      const storagePath = `${classDir}/${file}`;
      
      // Check if file already exists
      const { data: existing } = await supabase.storage
        .from(BUCKET)
        .list(classDir, { search: file });
      
      if (existing && existing.length > 0) {
        skipped++;
        process.stdout.write(`  ⏭ ${file} (exists)\r`);
        continue;
      }

      const ok = await uploadFile(localPath, storagePath);
      if (ok) {
        uploaded++;
        process.stdout.write(`  ✅ ${file} (${i + 1}/${files.length})\r`);
      }
    }
    console.log(); // newline after progress
  }

  console.log(`\n🎉 Done! Uploaded: ${uploaded}, Skipped: ${skipped}, Total: ${total}`);

  // Print the public URL pattern
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;
  console.log(`\n📎 Public URL pattern: ${publicUrl}/class-{N}/page-{NNN}.png`);
}

main().catch(console.error);
