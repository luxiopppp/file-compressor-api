const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const hc = require('heic-convert')

const tmpDir = path.resolve(__dirname, '../../tmp');
const staticDir = path.resolve(__dirname, '../static/compressed');

async function compressImage(fileName) {
  const isHEIC = fileName.toLowerCase().endsWith('.heic');
  let filePath = path.join(tmpDir, fileName);

  console.log(filePath, "before process")

  if (isHEIC) {
    filePath = await processHEIC(filePath);
  }
  
  console.log(filePath, "after process")

  const compressedPath = path.join(staticDir, path.parse(fileName).name + ".jpeg");

  return new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .outputOptions([ '-q:v 3' ])
      .save(compressedPath)
      .on('end', () => {
        fs.unlinkSync(filePath);
        console.log(`Archivo "${fileName}" comprimido!`);
        resolve(compressedPath);
      })
      .on('error', (err) => {
        console.log(err.message);
        reject(err);
      })
  })    
}

async function processHEIC(filePath) {
  try {
    let newFilePath = filePath;
    
    const inputBuffer = fs.readFileSync(filePath);
    const outputBuffer = await hc({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 1,
    });

    newFilePath = filePath.replace(/\.heic$/i, '.jpeg');
    fs.writeFileSync(newFilePath, outputBuffer);
    fs.unlinkSync(filePath);
    return newFilePath;
  } catch (err) {
    console.error('Error converting heic to jpeg:', err)
    throw err
  }
}

function compressVideo(fileName) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(tmpDir, fileName);
    const compressedPath = path.join(staticDir, path.parse(fileName).name + '.mp4');

    ffmpeg(filePath)
      .outputOptions([ '-crf 30' ])
      .save(compressedPath)
      .on('end', () => {
        fs.unlinkSync(filePath);
        console.log(`Archivo "${fileName}" comprimido!`);
        resolve(compressedPath);
      })
      .on('error', (err) => {
        console.log(err.message);
        reject(err);
      })

  })
}

module.exports = { compressImage, compressVideo, processHEIC }
