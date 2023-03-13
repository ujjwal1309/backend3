const role = {
  customer: {
    permissions: ["get"],
  },
  seller: {
    permissions: ["get", "post", "delete", "update"],
  },
};

function checkRoles(...roles) {
  return (req, res, next) => {
    console.log(req.url.toLowerCase())
    if (
      roles.includes(req.user.role) &&
      role[req.user.role].permissions.includes(req.method.toLowerCase())
    ) {
      return next();
    } else {
      return res.send({ msg: "Not authorized" });
    }
  };
}

module.exports = { checkRoles };
