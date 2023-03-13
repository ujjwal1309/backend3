const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "customer",
    enum: ["customer", "seller"],
  },
});

const UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
