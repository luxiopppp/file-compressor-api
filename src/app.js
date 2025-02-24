const express = require('express');
const cors = require('cors');
require( 'dotenv' ).config();

const upload = require('./utils/upload')
const { compressImage } = require('./utils/compress')

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
  
  const compressedImage = await compressImage(req.file.originalname)
  
  res.status(200).download(compressedImage);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`app running on port ${PORT}`))
