const express = require('express');
const cors = require('cors');
require( 'dotenv' ).config();

const upload = require('./utils/upload')
const { compressImage, compressVideo } = require('./utils/compress')

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('API running!')
})

app.post('/compress', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se ha subido ningún archivo" });
  }

  console.log("Archivo recibido:", req.file);

  const mimeType = req.file.mimetype;
  let returnFile;

  try {
    if (mimeType.startsWith('image/')) {
      returnFile = await compressImage(req.file.originalname)
    } else {
      returnFile = await compressVideo(req.file.originalname)
    }
  } catch (err) {
    res.status(500).send('Error en la compresión del archivo.')
  }
  
  res.status(200).download(returnFile);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`app running on port ${PORT}`))
