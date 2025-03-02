const express = require('express');
const cors = require('cors');
require( 'dotenv' ).config();
const path = require('path')

const upload = require('./utils/upload')
const { compressImage, compressVideo } = require('./utils/compress')

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('API running!')
})

app.post('/compress', upload.array('files'), async (req, res) => {
  if (!req.files) {
    return res.status(400).json({ error: "No se ha subido ningún archivo" });
  }

  console.log("Archivos recibidos:", req.files);

  try {
    const compressedFiles = await Promise.all(req.files.map(async ( file ) => {
      const mimeType = file.mimetype;
      let returnFile;

      if (mimeType.startsWith('image/')) {
        returnFile = await compressImage(file.originalname);
      } else if (mimeType.startsWith('video/')) {
        returnFile = await compressVideo(file.originalname);
      }
    
      return returnFile;
    }));

    res.status(200).send(compressedFiles)
  } catch (err) {
    res.status(500).send('Error en la compresión del archivo.')
  }
});

app.use('/compressed', express.static(path.join(__dirname, './static/compressed')))

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`app running on port ${PORT}`))
