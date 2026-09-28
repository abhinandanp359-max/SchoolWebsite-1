import sharp from 'sharp';
import fs from 'fs';

async function upscale() {
  try {
    const inputPath = 'public/images/hero/home-hero-students.jpg';
    const outputPath = 'public/images/hero/home-hero-students.webp';

    console.log('Upscaling image...');

    await sharp(inputPath)
      .resize({
        width: 2800,
        kernel: sharp.kernel.lanczos3,
        fastShrinkOnLoad: false
      })
      .sharpen({
        sigma: 1, // small radius
        m1: 1.5, // amount for flat areas
        m2: 0.5, // amount for jagged edges
        x1: 2, // threshold
        y2: 10,
        y3: 20
      })
      .webp({ 
        quality: 80, 
        effort: 6, // max compression effort
        smartSubsample: true
      })
      .toFile(outputPath);

    const stat = fs.statSync(outputPath);
    console.log(`Upscale complete. New file size: ${(stat.size / 1024).toFixed(2)} KB`);
  } catch (error) {
    console.error('Error during upscale:', error);
  }
}

upscale();
