const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const folderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    parentFolder: {
      type: String,
      required: true,
      ref: "folder",
    },

    isFolder: Boolean,
    imageData: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "images",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("folder", folderSchema);
