const mongoose = require("mongoose");

const MongoUrl = process.env.MongoUrl;

mongoose
  .connect(MongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(`connection success with mongoDB`);
  })
  .catch((err) => {
    console.log(`Error ${err}`);
  });
