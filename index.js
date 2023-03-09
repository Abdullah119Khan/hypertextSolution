const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const userRoutes = require("./routes/user.routes");
const { verifyTokenUser, verifyToken } = require("./utils/auth");
const ImageModel = require("./models/title.model");
const TitleModel = require("./models/Titles.model");
const UserModel = require("./models/user.model");

// Upload image with username and user directory
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const username = req.params.username;
    const title = req.params.title;
    const uploadPath = path.join(__dirname, `uploads/${username}/${title}`);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const maxSize = 1 * 1024 * 1024;
var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("image");

dotenv.config({ path: "./config/config.env" });
require("./dbConn/dbConn");

app.use(express.json());
app.use(cors());

// APIS for image upload
app.post("/api/user/file/:username/:title", verifyToken, (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json(`only accepted 1MB image`);
    } else {
      const image = new TitleModel({
        image: {
          data: req.file.filename,
          contentType: "image/png",
        },
      });
      const response = image.save();
      res.status(200).send({
        message: "success",
        response,
      });
    }
  });
});

// APIS for get all images
app.get("/api/user/getImage", async (req, res) => {
  try {
    const getImages = await ImageModel.find();
    return res.status(200).json(getImages);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// APIS for create folder with username
app.post("/api/create/user", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = new UserModel({ username, email, password });
    const savedUser = await newUser.save();
    let x = 0o50;

    fs.promises.mkdir(__dirname + "/uploads/" + username, x);
    return res.status(201).json(savedUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// APIS for create folder in folder
app.put("/api/user/create/folder/:id", verifyTokenUser, async (req, res) => {
  const { title } = req.body;
  const user = await UserModel.findById(req.params.id);

  try {
    if (user) {
      let x = 0o50;
      fs.promises.mkdir(__dirname + `/uploads/${user.username}/${title}`, x);
      const newTitle = new TitleModel({
        title: title,
      });
      const savedTitle = await newTitle.save();
      return res
        .status(200)
        .json({ message: "Directory is created success", savedTitle });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});

// APIS for GET ALL Folder name from database
app.get("/api/user/getfolder", async (req, res) => {
  try {
    const getFolder = await TitleModel.find();
    return res.status(200).json(getFolder);
  } catch (err) {
    return res.status(500).json(err);
  }
});

app.use("/api", userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server Running On PORT ${PORT}`);
});
