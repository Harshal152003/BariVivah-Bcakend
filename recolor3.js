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

function hslToRgb(h, s, l) {
  let r, g, b;
  if(s == 0){
    r = g = b = l; 
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
    
    // #FB2467 in HSL is roughly (0.948, 0.963, 0.562)
    const targetHue = 0.948;
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      const [h, s, l] = rgbToHsl(r, g, b);
      
      // Target purples (Bride's dress and buttons)
      if (h > 0.60 && h < 0.90 && s > 0.05) {
        // Boost saturation aggressively to match the vibrant pink
        const newS = Math.min(1.0, s * 4.0);
        
        // Lower the lightness to match the darker intensity of #FB2467
        // Original L is ~0.7, target is ~0.56. Let's scale it down by 0.8.
        const newL = Math.max(0, Math.min(1.0, l * 0.8));
        
        const [nr, ng, nb] = hslToRgb(targetHue, newS, newL);
        this.bitmap.data[idx + 0] = nr;
        this.bitmap.data[idx + 1] = ng;
        this.bitmap.data[idx + 2] = nb;
      }
      
      // Target light blue/grey (Groom's suit)
      else if (h > 0.50 && h < 0.65 && s < 0.40 && l > 0.4) {
        // Turn it white: reduce saturation to 0, increase lightness slightly
        const newL = Math.min(1.0, l * 1.2);
        const [nr, ng, nb] = hslToRgb(h, 0, newL);
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
  // Let's create a NEW file name to bust the Next.js cache entirely
  await recolor('./public/final.jpg', './public/final_vibrant_pink.jpg');
  await recolor('./public/Finaltwo.png', './public/Finaltwo_vibrant_pink.png');
}

main();
