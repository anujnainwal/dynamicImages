const Image = require("../../model/image/image.model");
const fs = require("fs");
const path = require("path");
const { ITEMS_PER_PAGE } = require("../../util/service");
const { default: mongoose } = require("mongoose");
const FolderModel = require("../../model/folder/Folder.model");
let totalImages;
const getAllImages = async (req, res, next) => {
  try {
    let { type, page } = req.query;
    let pages = parseInt(page) || 1;
    const ITEMS_PER_PAGE = 4; // Define the number of items per page

    const imgData = [];
    let images;
    let count = 0;
    let totalImages = 0;

    if (type === "null") {
      // Retrieve all images with pagination
      const numImages = await Image.countDocuments();
      totalImages = numImages;

      images = await Image.find()
        .populate("folder")
        .skip((pages - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);

      if (!images || images.length === 0) {
        return res.status(404).json({ error: "No Images found." });
      }

      count = images.length;
      console.log(images)
      for (let image of images) {
        const imgPath = path.join(__dirname, "../../", image.imgpath);
        console.log(image)
        if (fs.existsSync(imgPath)) {
          const data = fs.readFileSync(imgPath);
          const base64Data = data.toString("base64");
          const mimeType = path.extname(imgPath).replace(".", "");
          
          imgData.push({
            _id: image._id,
            filename: image.imgpath,
            imageName: image.imageName,
            data: `data:image/${mimeType};base64,${base64Data}`,
          });
        }
      }
    } else if (mongoose.Types.ObjectId.isValid(type)) {
      // Retrieve images belonging to a folder with pagination
      const folder = await FolderModel.findOne({ _id: type }).populate("imageData");
      if (!folder) {
        return res.status(404).json({ error: "Folder not found." });
      }

      const numImages = folder.imageData.length;
      totalImages = numImages;

      images = await FolderModel.findOne({ _id: type })
        .populate({
          path: "imageData",
          options: {
            skip: (pages - 1) * ITEMS_PER_PAGE,
            limit: ITEMS_PER_PAGE,
          },
        })
        .exec();
        

      if (!images || !images.imageData || images.imageData.length === 0) {
        return res.status(404).json({ error: "No Images found." });
      }

      count = images.imageData.length;

      for (let image of images.imageData) {
        const imgPath = path.join(__dirname, "../../", image.imgpath);
        
        if (fs.existsSync(imgPath)) {
          const data = fs.readFileSync(imgPath);
          const base64Data = data.toString("base64");
          const mimeType = path.extname(imgPath).replace(".", "");

          imgData.push({
            _id: image._id,
            filename: image.imgpath,
            imageName: image.imageName,
            data: `data:image/${mimeType};base64,${base64Data}`,
          });
        }
      }
    } else {
      return res.status(400).json({ error: "No Image Found." });
    }

    return res.status(200).json({
      Imgdata: imgData,
      count,
      currentPage: pages,
      hasNextPage: ITEMS_PER_PAGE * pages < totalImages,
      hasPrevPage: pages > 1,
      nextPage: pages + 1,
      previousPage: pages - 1,
      lastPage: Math.ceil(totalImages / ITEMS_PER_PAGE),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getAllImages;
