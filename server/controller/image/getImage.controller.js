const Image = require("../../model/image/image.model");
const fs = require("fs");
const getImage = async (req, res) => {
  let { id } = req.params;
  try {
    let img = await Image.findById({ _id: id });

    if (!img) {
      return res.status(404).json({ error: "Image not found." });
    }

    const data = fs.readFileSync(img.path);

    return res.status(200).json({ Imgdata: JSON.parse(data) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = getImage;
