import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
  const sizes = [16, 32, 48, 128];
  const outputDir = path.join(__dirname, 'icons');

  // Create icons directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Tetrahedral SVG template
  const svgTemplate = (size) => `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tetraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#4ECDC4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#45B7D1;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background circle -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="url(#tetraGradient)" stroke="#333" stroke-width="2"/>

      <!-- Tetrahedron outline -->
      <path d="M ${size/2} ${size*0.2} L ${size*0.8} ${size*0.6} L ${size*0.2} ${size*0.6} Z" fill="none" stroke="white" stroke-width="${Math.max(1, size/32)}"/>
      <path d="M ${size/2} ${size*0.2} L ${size*0.8} ${size*0.6} L ${size/2} ${size*0.8} Z" fill="none" stroke="white" stroke-width="${Math.max(1, size/32)}"/>
      <path d="M ${size/2} ${size*0.2} L ${size*0.2} ${size*0.6} L ${size/2} ${size*0.8} Z" fill="none" stroke="white" stroke-width="${Math.max(1, size/32)}"/>
      <path d="M ${size*0.2} ${size*0.6} L ${size*0.8} ${size*0.6} L ${size/2} ${size*0.8} Z" fill="none" stroke="white" stroke-width="${Math.max(1, size/32)}"/>

      <!-- Inner glow -->
      <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
    </svg>
  `;

  console.log('🎨 Generating Phenix Donation Wallet icons...');

  for (const size of sizes) {
    const svgBuffer = Buffer.from(svgTemplate(size));
    const outputPath = path.join(outputDir, `icon${size}.png`);

    await sharp(svgBuffer)
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated ${size}x${size} icon`);
  }

  console.log('🎉 All icons generated successfully!');
  console.log(`📁 Icons saved to: ${outputDir}`);
}

generateIcons().catch(console.error);