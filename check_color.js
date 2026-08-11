const { Jimp } = require('jimp');

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if(max == min){
    h = s = 0; 
  }else{
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

async function check() {
  const image = await Jimp.read('./public/final.jpg');
  
  // Let's sample a few pixels from the center where the dress likely is
  // Width: 1920, Height: 1080? No, wait. 
  // The Next.js image says width={1920} but what is the actual image size?
  console.log(`Dimensions: ${image.bitmap.width}x${image.bitmap.height}`);
  
  // Sample pixels at the center of the image
  const cx = Math.floor(image.bitmap.width / 2);
  const cy = Math.floor(image.bitmap.height / 2);
  
  for (let y = cy - 20; y < cy + 100; y += 20) {
    for (let x = cx - 50; x < cx + 50; x += 20) {
      if (x >= 0 && y >= 0 && x < image.bitmap.width && y < image.bitmap.height) {
        const idx = (image.bitmap.width * y + x) << 2;
        const r = image.bitmap.data[idx];
        const g = image.bitmap.data[idx+1];
        const b = image.bitmap.data[idx+2];
        const [h, s, l] = rgbToHsl(r, g, b);
        if (s > 0.1) {
            console.log(`Pixel(${x},${y}): RGB(${r},${g},${b}) -> HSL(${h.toFixed(3)}, ${s.toFixed(3)}, ${l.toFixed(3)})`);
        }
      }
    }
  }
}

check();
