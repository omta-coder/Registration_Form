const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("MongoDb connected");
  })
  .catch((err) => {
    console.error(err);
  });

//userSchema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) {
      const newUser = new User({ name, email, password });
      await newUser.save();
      res.redirect("/success");
    } else {
      console.log("Email is already registered!");
      res.redirect("/error");
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});
app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
