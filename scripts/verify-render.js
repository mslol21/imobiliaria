const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const browserCandidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
];

const browserPath = browserCandidates.find(p => fs.existsSync(p));
const tempDir = process.env.TEMP || 'C:\\Windows\\Temp';
const desktopPath = path.join(tempDir, 'desktop-1440.png');
const mobilePath = path.join(tempDir, 'mobile-390.png');

if (browserPath) {
  try {
    console.log('Rendering Desktop 1440x900 to', desktopPath);
    execSync(`"${browserPath}" --headless=new --disable-gpu --no-sandbox --window-size=1440,900 --screenshot="${desktopPath}" http://localhost:3000/`, { stdio: 'inherit' });
    console.log('Desktop screenshot created:', fs.existsSync(desktopPath), 'Size:', fs.existsSync(desktopPath) ? fs.statSync(desktopPath).size : 0);

    console.log('Rendering Mobile 390x844 to', mobilePath);
    execSync(`"${browserPath}" --headless=new --disable-gpu --no-sandbox --window-size=390,844 --screenshot="${mobilePath}" http://localhost:3000/`, { stdio: 'inherit' });
    console.log('Mobile screenshot created:', fs.existsSync(mobilePath), 'Size:', fs.existsSync(mobilePath) ? fs.statSync(mobilePath).size : 0);
  } catch (err) {
    console.error('Render error:', err.message);
  }
}
