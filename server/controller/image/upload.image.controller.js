const FolderModel = require("../../model/folder/Folder.model");
const Image = require("../../model/image/image.model");
const fs = require("fs");
const uploadImage = async (req, res, next) => {
  const { imageName, folderId } = req.body;
  console.log("upload", folderId);
  try {
    const folder = await FolderModel.findById({ _id: folderId });
    if (!folder) {
      return res.status(400).json({ error: "Folder not found." });
    }

    var datas = {
      version: "5.3.0",

      backgroundImage: {
        type: "image",
        version: "5.3.0",

        src: req.body.data,
        crossOrigin: null,
      },
    };
    var fileT = req.body.filename.split(".");
    var type = fileT[fileT.length - 1];

    var jsonContent = JSON.stringify(datas);

    //upload image with name
    let name;
    if (type == "png") {
      name = imageName.replace(".png", "");
    }
    if (type == "jpeg" || type == "jpg") {
      name = imageName.replace(".jpg", "");
    }

    let img = new Image({
      imageName: name,
      fieldname: "image",
      folder: folderId,
    });
    img.save(async (err, data) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        await FolderModel.findByIdAndUpdate(
          { _id: folderId },
          {
            $push: { imageData: img._id },
          },
          {
            new: true,
          }
        );

        Image.findOneAndUpdate(
          { _id: img._id },
          {
            $set: {
              path: "./uploads/json/" + img._id + ".json",
              imgpath: "./uploads/images/" + img._id + `.${type}`,
            },
          },
          (err) => {
            if (err) {
              throw err;
            } else {
              var base64D = req.body.data;
              if (type == "png") {
                var base64Data = base64D.replace(
                  /^data:image\/png;base64,/,
                  ""
                );
              }
              if (type == "jpeg" || type == "jpg") {
                var base64Data = base64D.replace(
                  /^data:image\/jpeg;base64,/,
                  ""
                );
              }
              require("fs").writeFile(
                "./uploads/images/" + img._id + `.${type}`,
                base64Data,
                "base64",
                function (err) {
                  if (err) {
                    return res.status(201).json({
                      message: "Image not uploaded successfully.",
                      id: img._id,
                    });
                  } else {
                    fs.writeFile(
                      "./uploads/json/" + img._id + ".json",
                      jsonContent,
                      "utf8",
                      function (err) {
                        if (err) {
                          console.log(
                            "An error occured while writing JSON Object to File."
                          );
                          return console.log(err);
                        } else {
                          //write code heer
                          return res.status(201).json({
                            message: "Data save successfull",
                            id: img._id,
                          });
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
      // return res.status(200).json({ data, img: img._id });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = uploadImage;
