const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/myDatabase");

const Schema = mongoose.Schema;
const UserDetail = new Schema({
  username: String,
  password: String
});
const UserDetails = mongoose.model("userInfo", UserDetail, "userInfo");

module.exports = UserDetails;
