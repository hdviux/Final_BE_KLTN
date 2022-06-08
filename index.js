const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const useRouter = require("./router/index");
const cors = require("cors");
const path = require('path');
const app = express();
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOGB_CONNECT_KEY, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected Succsess!!!");
  } catch (error) {
    console.log(error);
    console.log("Connected Failed!!!");
  }
};

connectDB();
app.use(express.json());
app.use(cors());
app.use("/", useRouter);
app.use('/Bill', express.static(path.join(__dirname, 'Bill')));
app.listen(process.env.PORT || 5000, () => console.log("Server started!!!"));
