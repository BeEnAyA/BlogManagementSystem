const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Uploads/Users/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var blogStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "Uploads/Blogs/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});



module.exports = {
  multer,
  storage,
  blogStorage,
};