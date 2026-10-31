import fs from 'fs';
import path from 'path';

const MEMES = [
  { name: 'this_is_fine.jpg', url: 'https://i.imgflip.com/wxica.jpg' },
  { name: 'disaster_girl.jpg', url: 'https://i.imgflip.com/23ls.jpg' },
  { name: 'drake_var.jpg', url: 'https://i.imgflip.com/30b1gx.jpg' },
  { name: 'draw_25.jpg', url: 'https://i.imgflip.com/3lmzyx.jpg' },
  { name: 'clown_makeup.jpg', url: 'https://i.imgflip.com/38el31.jpg' },
  { name: 'cat_yelling.jpg', url: 'https://i.imgflip.com/345v97.jpg' },
  { name: 'panik_kalm.png', url: 'https://i.imgflip.com/3qqcim.png' },
  { name: 'spiderman.jpg', url: 'https://i.imgflip.com/1tkjq9.jpg' },
  { name: 'roll_safe.jpg', url: 'https://i.imgflip.com/1h7in3.jpg' },
];

const outDir = path.resolve('public', 'memes');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function downloadAll() {
  for (const item of MEMES) {
    const dest = path.join(outDir, item.name);
    try {
      console.log(`Downloading ${item.name}...`);
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const arrayBuffer = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(arrayBuffer));
      console.log(`Saved ${item.name} (${arrayBuffer.byteLength} bytes)`);
    } catch (err) {
      console.error(`Failed ${item.name}:`, err.message);
    }
  }
}

downloadAll();
