const fs = require('fs');
const path = require('path');

const staticDir = path.resolve(__dirname, '../static/compressed');

function deleteCompFiles(files) {
  setTimeout(() => {
    files.forEach((file) => {
      const fileDir = path.join(staticDir, path.basename(file));

      fs.unlink(fileDir, (err) => {
        if (err) {
          console.error(`Error al eliminar el archivo ${file}:`, err);
        } else {
          console.log(`Archivo eliminado: ${file}`);
        }
      });
    });
    console.log("Limpieza completa de:\n", files);
  }, 600000)
}

module.exports = { deleteCompFiles }
