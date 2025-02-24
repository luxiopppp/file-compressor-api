const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.resolve(__dirname, '../../uploads');

async function compressImage(fileName) {
  const filePath = path.join(uploadsDir, fileName);
  const ext = path.extname(fileName);
  const tempPath = path.join( uploadsDir, fileName.replace(ext, `.compressed${ext}` ));
  const compressedPath = path.join(uploadsDir, path.parse(fileName).name + '.jpeg');

  try {
    await sharp(filePath)
      .jpeg({ quality: 60 })
      .toFile(tempPath);
    
    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, compressedPath);

    console.log('Archivo comprimido!');
    return compressedPath;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { compressImage }
