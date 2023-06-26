const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("./uploads");
    } else {
      cb(null, "uploads");
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(
      null,
      file.originalname.replace(file.originalname, crypto.randomUUID()) + ext
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/png", "image/PNG","image.JPEG","image.jpg","image.JPG"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb({ error: "Only" }, false);
  }
};

let upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: 1024 * 1024, // 1MB
});
module.exports = upload;
