const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { blacklistModel } = require("../models/blacklist.model");

const signup = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const user = await UserModel.find({ email });
    console.log(user);
    if (!user.length) {
      const hashPass = bcrypt.hashSync(password, 5);

      const user = new UserModel({ username, email, password: hashPass, role });

      await user.save();
      res.send({ msg: "user has been registered" });
    } else {
      res.send({ msg: "User already exist Please login" });
    }
  } catch (error) {
    res.send({ msg: "err", err: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });
    if (user.length) {
      const isPass = bcrypt.compareSync(password, user[0].password);

      if (!isPass) return res.send({ msg: "Password doesn't match" });

      //Access token

      const token = jwt.sign({ UserId: user[0]._id }, process.env.JWT_SECRET, {
        expiresIn: "1m",
      });

      //Refresh Token

      const refreshToken = jwt.sign(
        { UserId: user[0]._id },
        process.env.REFRESH_JWT_SECRET,
        {
          expiresIn: "5m",
        }
      );

      res.send({ msg: "Login Success", token, refreshToken });
    } else {
      res.send({ msg: "email and password doesn't match" });
    }
  } catch (error) {
    res.send({ msg: "err", err: error.message });
  }
};

const logout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const blacklisted = new blacklistModel({ token });
    await blacklisted.save();
    res.send({ msg: "user has successfully logged out" });
  } catch (error) {
    res.send({ msg: "err", err: error.message });
  }
};

module.exports = { signup, login, logout };
