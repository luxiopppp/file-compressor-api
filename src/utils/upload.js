const multer = require('multer');
const path = require('path');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/')},
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName = file.originalname.split(fileExt)[0];

      cb(null, `${fileName}${fileExt}`);
    }
  })
});

module.exports = upload;
