const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const tmpDir = path.resolve(__dirname, '../../tmp');
const staticDir = path.resolve(__dirname, '../static/compressed');

async function compressImage(fileName) {
  const filePath = path.join(tmpDir, fileName);
  // const ext = path.extname(fileName);
  // const tempPath = path.join( uploadsDir, fileName.replace(ext, `.compressed${ext}` ));
  const compressedPath = path.join(staticDir, path.parse(fileName).name + '.jpeg');

  try {
    await sharp(filePath)
      .jpeg({ quality: 60 })
      // .toFile(tempPath);
      .toFile(compressedPath)
    
    fs.unlinkSync(filePath);
    // fs.renameSync(tempPath, compressedPath);

    console.log('Archivo comprimido!');
    return compressedPath;
  } catch (err) {
    throw new Error(err.message);
  }
}

function compressVideo(fileName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(tmpDir, fileName);
    // const ext = path.extname(fileName);
    // const tempPath = path.join( uploadsDir, fileName.replace(ext, `.compressed${ext}` ));
    const compressedPath = path.join(staticDir, path.parse(fileName).name + '.mp4');

    ffmpeg(filePath)
      .outputOptions('-crf 30')
      // .save(tempPath)
      .save(compressedPath)
      .on('end', () => {
        fs.unlinkSync(filePath);
        // fs.renameSync(tempPath, compressedPath);
        console.log('Archivo comprimido!');
        resolve(compressedPath);
      })
      .on('error', (err) => {
        console.log(err.message);
        reject(err);
      })

  })
}

module.exports = { compressImage, compressVideo }
