const mongoose = require("mongoose");

const TitleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const TitleModel = mongoose.model("title", TitleSchema);

module.exports = TitleModel;
