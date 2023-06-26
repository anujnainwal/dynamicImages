const Image = require("../model/image/image.model");
const fs = require("fs");
const saveJson = async (req, res) => {
  try {
    let { idImage, data, imageName } = req.body;
    var jsonContent = JSON.stringify(data);
    fs.writeFile(
      `${process.cwd()}/uploads/json/` + idImage + ".json",
      jsonContent,
      "utf8",
      async function (err) {
        if (err) {
          console.log("testingLLL::::::::::::::::::::",process.cwd())
          console.log("An error occured while writing JSON Object to File.");
          return res.status(500).json({name:"for tsting:", error: err });
        } else {
          let imgId = await Image.findOneAndUpdate(
            { _id: idImage },
            {
              $set: {
                path: "./uploads/json/" + idImage + ".json",
              },
            }
          );  
          console.log("SAVED::::::::::::::::::::::::::::::::::::::::::::::::::::",imgId)
          return res.status(200).json({ message: "Data save successfull" });
        }
      }
    );


    // fs.writeFile(
    //   ".../uploads/json/" + idImage + ".json",
    //   jsonContent,
    //   "utf8",
    //   async function (err) {
    //     if (err) {
    //       console.log("testingLLL::::::::::::::::::::",process.cwd())
    //       console.log("An error occured while writing JSON Object to File.");
    //       return res.status(500).json({name:"for tsting:", error: err });
    //     } else {
    //       let imgId = await Image.findOneAndUpdate(
    //         { _id: idImage },
    //         {
    //           $set: {
    //             path: "./uploads/json/" + idImage + ".json",
    //           },
    //         }
    //       );  
    //       console.log("SAVED::::::::::::::::::::::::::::::::::::::::::::::::::::",imgId)
    //       return res.status(200).json({ message: "Data save successfull" });
    //     }
    //   }
    // );
  } catch (error) {
    console.log("newERROOOOOOOOOOOOOR:",error);
    return res.status(500).json({msg:"last-cathc::::::::::::", error: error.message });
  }
};
module.exports = saveJson;
