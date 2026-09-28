import sharp from 'sharp';
import fs from 'fs';

async function processImages() {
  try {
    const file = 'public/images/hero/home-hero-students.jpg';
    const outWebp = 'public/images/hero/home-hero-students.webp';
    await sharp(file).webp({ quality: 85, effort: 6 }).toFile(outWebp);
    console.log('WebP size:', fs.statSync(outWebp).size / 1024);

    const mFile = 'public/images/hero/home-hero-students-mobile.jpg';
    const mOutWebp = 'public/images/hero/home-hero-students-mobile.webp';
    await sharp(mFile).webp({ quality: 85, effort: 6 }).toFile(mOutWebp);
    console.log('Mobile WebP size:', fs.statSync(mOutWebp).size / 1024);

    const lqip = await sharp(file).resize(40).webp({ quality: 20 }).toBuffer();
    console.log('LQIP:', lqip.toString('base64'));
  } catch (e) { console.error(e); }
}
processImages();
