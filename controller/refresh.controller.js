const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");

const refresh = async (req, res) => {
  const refreshToken = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);

    const user = await UserModel.find({ _id: decoded.UserId });

    if (!user.length) return res.send({ msg: "please login again" });

    const token = jwt.sign({ UserId: user[0]._id }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });

    res.send({ token });
  } catch (error) {
    res.send({ msg: "err", err: error.message });
  }
};

module.exports = { refresh };
