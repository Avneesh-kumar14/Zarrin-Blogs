const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router()
// const upload = multer({ dest: 'uploads/' })


// app.post('/blog', upload.single('image'), function (req, res, next) {
//     return res.status(200).json({ data: req.body })
// })

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 } 
});

router.post('/', upload.single('myFile'), (req, res) => {
  if (!req.file) {
    // /uploads/myFile-17.png
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded successfully: ${req.file.filename}`);
});


module.exports = router