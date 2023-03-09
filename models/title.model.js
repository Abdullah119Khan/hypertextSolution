const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    image: {
      data: Buffer,
      contentType: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const ImageModel = mongoose.model("image", imageSchema);

module.exports = ImageModel;
