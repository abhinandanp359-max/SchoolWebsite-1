import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve('public/images');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      
      try {
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
          const webpPath = fullPath.replace(ext, '.webp');
          console.log(`Converting ${file} to WebP...`);
          await sharp(fullPath)
            .webp({ quality: 80 })
            .toFile(webpPath);
          fs.unlinkSync(fullPath); // delete original
          console.log(`Deleted original ${file}`);
        } else if (ext === '.webp') {
          // Re-compress existing webp if it's large (e.g. > 200KB)
          if (stat.size > 200 * 1024) {
            console.log(`Compressing large WebP ${file}...`);
            const tempPath = fullPath + '.temp';
            await sharp(fullPath)
              .webp({ quality: 75 })
              .toFile(tempPath);
            fs.unlinkSync(fullPath);
            fs.renameSync(tempPath, fullPath);
            console.log(`Compressed ${file}`);
          }
        }
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

async function main() {
  console.log('Starting image optimization...');
  await processDirectory(PUBLIC_DIR);
  console.log('Done!');
}

main();
