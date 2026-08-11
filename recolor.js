const { Jimp } = require('jimp');
const fs = require('fs');

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if(max == min){
    h = s = 0; // achromatic
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

function hslToRgb(h, s, l) {
  let r, g, b;
  if(s == 0){
    r = g = b = l; // achromatic
  }else{
    const hue2rgb = function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

async function recolor(imagePath, targetPath) {
  try {
    console.log(`Processing ${imagePath}...`);
    const image = await Jimp.read(imagePath);
    const targetHue = 0.948; // ~341 degrees for #FB2467
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      const [h, s, l] = rgbToHsl(r, g, b);
      
      // Target purples: hue between ~240 (0.66) and ~310 (0.86)
      // Also ensure saturation is not totally zero
      if (h > 0.60 && h < 0.90 && s > 0.05) {
        // Shift hue to targetHue
        // Increase saturation slightly to match the vibrant pink
        const newS = Math.min(1.0, s * 1.3);
        
        const [nr, ng, nb] = hslToRgb(targetHue, newS, l);
        this.bitmap.data[idx + 0] = nr;
        this.bitmap.data[idx + 1] = ng;
        this.bitmap.data[idx + 2] = nb;
      }
    });
    
    image.write(targetPath);
    console.log(`Saved ${targetPath}`);
  } catch (err) {
    console.error(`Error processing ${imagePath}:`, err);
  }
}

async function main() {
  await recolor('./public/final.jpg', './public/final_pink.jpg');
  await recolor('./public/Finaltwo.png', './public/Finaltwo_pink.png');
}

main();
