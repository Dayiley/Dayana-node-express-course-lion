const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect(url, {
    dbName: "03-TASK-MANAGER",
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
