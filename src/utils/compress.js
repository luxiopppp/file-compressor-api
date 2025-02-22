const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.resolve(__dirname, '../../uploads');

async function compressImage(fileName) {
  try {
    const filePath = path.join(uploadsDir, fileName)
    const compressedPath = path.join(uploadsDir, 'compressed_' + path.parse(fileName).name + '.jpeg');

    await sharp(filePath)
      .jpeg({ quality: 60 })
      .toFile(compressedPath);
    
    fs.unlinkSync(filePath);

    console.log('Archivo comprimido!');
    return filePath
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { compressImage }
