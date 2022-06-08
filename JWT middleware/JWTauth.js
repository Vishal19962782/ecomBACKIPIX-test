const jwt = require("jsonwebtoken");
exports.verify = (req, res, next) => {
  const authheader = req.headers.token;
  if (authheader) {
    const token = JSON.stringify(authheader)
    jwt.verify(JSON.parse(token), "secretkey", (err, user) => {
      if (err) return res.status(403).json("token not valid");
      else req.headers.user = user.id;
      next();
    });
  } else {
    console.log("NOTTT AUTH")
    res.status(400).json({ message: "Not authenticated" });
  }
};
 