const express = require("express");
const uploadImage = require("../controller/image/upload.image.controller");
const getImage = require("../controller/image/getImage.controller");
const imageModify = require("../controller/image/image.controller");
const saveJson = require("../controller/save.controller");
const getAllImages = require("../controller/image/get.all.images");
const {
  getCountDown,
} = require("../controller/countdown/countdown.controller");
const router = express.Router();

// router.post("/upload-image", upload.single("image"), uploadImage);
router.post("/upload", uploadImage);
router.get("/images", getAllImages);
router.get("/image/:id", getImage);
router.get("/preview/:id", imageModify);
router.post("/save", saveJson);

/*
Count Down TImmer routes
*/
router.get("/countdown", getCountDown);

module.exports = router;
