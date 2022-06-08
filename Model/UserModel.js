const mongoose = require("mongoose");
const Schema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    },
  ],
});
const User = mongoose.model("User", Schema);
module.exports = User;
 