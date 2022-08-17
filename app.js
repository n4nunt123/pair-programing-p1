const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes/router');
const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Configure file upload destination
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    // Configure filename
    cb(null, new Date().toString() + '-' + file.originalname);
  }
})

// Configure only filetype image can be uploaded
const fileFilter = (req, file, cb) => {
  if( file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ) {
        cb(null, true);
  } else {
    cb(null, false);
  }
}

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use("/", routes);

app.listen(port, () => {
  console.log(`This app is listening on port ${port}`);
})