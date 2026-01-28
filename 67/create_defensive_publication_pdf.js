#!/usr/bin/env node

/**
 * Create PDF version of defensive publication for submission
 * Converts markdown to professional PDF format
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple markdown to HTML converter for basic formatting
function markdownToHtml(markdown) {
  let html = markdown
    // Headers
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Lists
    .replace(/^\* (.*$)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap in HTML structure
  html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIC-POVM Quantum Key Distribution System - Defensive Publication</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.6;
            margin: 40px;
            font-size: 12pt;
        }
        h1 { font-size: 18pt; margin: 24pt 0 12pt 0; text-align: center; }
        h2 { font-size: 14pt; margin: 20pt 0 8pt 0; border-bottom: 1px solid #000; }
        h3 { font-size: 12pt; margin: 16pt 0 6pt 0; }
        h4 { font-size: 11pt; margin: 12pt 0 4pt 0; }
        p { margin: 8pt 0; text-align: justify; }
        strong { font-weight: bold; }
        em { font-style: italic; }
        code { font-family: 'Courier New', monospace; background: #f5f5f5; padding: 2px 4px; }
        pre { background: #f5f5f5; padding: 8pt; margin: 8pt 0; font-family: 'Courier New', monospace; font-size: 10pt; }
        ul, ol { margin: 8pt 0; padding-left: 20pt; }
        li { margin: 4pt 0; }
        table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
        th, td { border: 1px solid #000; padding: 4pt; text-align: left; }
        th { background: #f0f0f0; }
        .center { text-align: center; }
        .page-break { page-break-before: always; }
    </style>
</head>
<body>
    <h1>SIC-POVM Quantum Key Distribution System with Reference-Frame Independence and Mesh Networking</h1>
    <p class="center"><em>Defensive Publication - Establishing Prior Art</em></p>
    <p class="center">Publication Date: January 20, 2026</p>
    <p class="center">Document Version: 1.0</p>
    <p class="center">SHA-256: 2d017d7ee05c244741f0bbb3be6f82d65bbc65546096424203b7fbdd9e3906b6</p>

    ${html}
</body>
</html>`;

  return html;
}

// Read the markdown file
const markdownPath = 'SIC_POVM_QKD_DEFENSIVE_PUBLICATION.md';
const pdfPath = 'SIC_POVM_QKD_DEFENSIVE_PUBLICATION.pdf';

try {
  const markdown = fs.readFileSync(markdownPath, 'utf8');
  const html = markdownToHtml(markdown);

  // Write HTML file (intermediate step)
  const htmlPath = 'SIC_POVM_QKD_DEFENSIVE_PUBLICATION.html';
  fs.writeFileSync(htmlPath, html);

  console.log('✅ HTML version created:', htmlPath);
  console.log('📄 Ready for PDF conversion');
  console.log('');
  console.log('To create PDF, use one of these methods:');
  console.log('1. Chrome: Open HTML file and Print → Save as PDF');
  console.log('2. wkhtmltopdf: wkhtmltopdf', htmlPath, pdfPath);
  console.log('3. Puppeteer: npm install puppeteer && node pdf-generator.js');
  console.log('4. Online converter: upload HTML to pdfcrowd.com or similar');
  console.log('');
  console.log('Recommended settings:');
  console.log('- Paper size: A4 or Letter');
  console.log('- Margins: 1 inch all sides');
  console.log('- Scale: 100%');
  console.log('- Print backgrounds: Enabled');

} catch (error) {
  console.error('❌ Error creating HTML:', error.message);
  process.exit(1);
}