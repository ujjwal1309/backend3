const jwt = require("jsonwebtoken");
const { blacklistModel } = require("../models/blacklist.model");
const { UserModel } = require("../models/user.model");
require("dotenv").config();

const authenticator = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    //checking if token is blacklisted or not
    const isBlacklisted = await blacklistModel.find({ token });

    if (isBlacklisted.length)
      return res.send({ msg: "token has been blacklisted" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.find({ _id: decoded.UserId });
    req.user = user[0];
    next();
  } catch (error) {
    res.send({ msg: "err", err: error.message });
  }
};

module.exports = { authenticator };
