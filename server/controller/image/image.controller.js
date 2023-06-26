var fs = require("fs");
const Image = require("../../model/image/image.model");
var fabric = require("fabric").fabric, // or import { fabric } from 'fabric';
  http = require("http"),
  url = require("url"),
  path = require("path");
const imageModify = async (req, res, next) => {
  let { id } = req.params;

  let jsonData = 
    `${process.cwd()}/uploads/json/` + `${id}` + ".json"
  console.log('json data',jsonData)

  try {
    const data = fs.readFileSync(jsonData);

    var fdata = JSON.parse(data);
    var fdataObjects = fdata.objects;

    var urlV = req.query;

    var objectkey = [];
    Object.entries(fdata.objects).forEach(([key, value]) => {
      objectkey.push(value.text);
    });

    let entries = Object.entries(urlV);
    let data1 = entries.map(([key, val] = entry) => {
      var index = objectkey.indexOf(key);
      if (index !== -1) {
        objectkey[index] = val;
      }
    });

    objectkey.forEach(function (item, index) {
      fdata.objects[index].text = item;
    });

    var canvas = new fabric.StaticCanvas(null, { width: 800, height: 600 });
    canvas.loadFromJSON(fdata, function () {
      const backgroundImage = canvas.backgroundImage;

      if (backgroundImage) {
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();

        const imageWidth = backgroundImage.width;
        const imageHeight = backgroundImage.height;
        const widthRatio = canvasWidth / imageWidth;
        const heightRatio = canvasHeight / imageHeight;
        const scale = Math.min(widthRatio, heightRatio);
        backgroundImage.scale(scale);
        canvas.setDimensions({
          width: imageWidth * scale,
          height: imageHeight * scale,
        });
        canvas.centerObject(backgroundImage);
      }
      canvas.renderAll();

      var stream = canvas.createPNGStream();

      stream.on("data", function (chunk) {
        res.write(chunk);
      });

      stream.on("end", function () {
        res.end();
      });
    });
  } catch (error) {
    console.log('sdsds',error)
    return res.status(500).json({ message: error.message });
  }
};

module.exports = imageModify;
