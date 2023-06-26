const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema(
  {
    imageName: {
      type: String,
      required: true,
    },
    fieldname: {
      type: String,
      required: true,
    },
    imgpath: {
      type: String,
    },
    path: {
      type: String,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "folder",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

let Image = mongoose.model("images", imageSchema);

module.exports = Image;
