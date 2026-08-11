import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function processUserLogo() {
  const inputPath = path.resolve('public', 'timetable.png');
  const icon192Path = path.resolve('public', 'icon-192.png');
  const icon512Path = path.resolve('public', 'icon-512.png');
  const appleIconPath = path.resolve('public', 'apple-touch-icon.png');
  const faviconPngPath = path.resolve('public', 'favicon.png');

  if (!fs.existsSync(inputPath)) {
    console.error('Error: public/timetable.png not found!');
    return;
  }

  console.log('✔ Found uploaded public/timetable.png! Processing icons with rounded edges...');

  const sourceBuffer = fs.readFileSync(inputPath);

  async function generateRoundedIcon(size, outputPath) {
    const radius = Math.floor(size * 0.2); // Sleek rounded corners (iOS & Android icon style)

    const maskSvg = Buffer.from(
      `<svg width="${size}" height="${size}">
        <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#ffffff"/>
      </svg>`
    );

    const resizedImage = await sharp(sourceBuffer)
      .resize(size, size, { fit: 'cover', position: 'center' })
      .toBuffer();

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 } // Pitch black canvas
      }
    })
    .composite([
      { input: resizedImage, blend: 'over' },
      { input: maskSvg, blend: 'dest-in' }
    ])
    .png()
    .toFile(outputPath);

    console.log(`✔ Generated rounded icon: ${size}x${size} -> ${outputPath}`);
  }

  await generateRoundedIcon(192, icon192Path);
  await generateRoundedIcon(512, icon512Path);
  await generateRoundedIcon(180, appleIconPath);
  await generateRoundedIcon(64, faviconPngPath);
}

processUserLogo().catch((err) => {
  console.error('Error processing timetable.png PWA icon:', err);
});
