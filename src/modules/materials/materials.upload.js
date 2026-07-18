const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

const uploadMaterialFile = upload.single("file");

module.exports = { uploadMaterialFile };
