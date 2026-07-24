const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const logoPath = path.join(__dirname, '../public/logo.png');

console.log('Uploading logo to Cloudinary from:', logoPath);

cloudinary.uploader.upload(logoPath, {
  folder: 'barivivah_branding',
  public_id: 'logo',
  overwrite: true,
  resource_type: 'image'
})
.then(result => {
  console.log('Upload successful!');
  console.log('Secure URL:', result.secure_url);
  console.log('URL:', result.url);
})
.catch(error => {
  console.error('Upload failed:', error);
});
