const express = require("express");
const router = express.Router();
const Product = require("../Model/ProductModel");
const User = require("../Model/UserModel");
const { faker } = require("@faker-js/faker");
const { verify } = require("../JWT middleware/JWTauth");

const generateProduct = () => {
  const image = faker.image.business();
  const name = faker.commerce.productName().split(" ").splice(0, 2).join(" ");
  const price = faker.commerce.price();
  const description = faker.lorem.paragraph();
  return {
    name,
    price,
    image,
    description,
  };
};

router.post("/generateProducts", async (req, res) => {
  try {
    const products = [];
    for (let i = 0; i < 10; i++) {
      const product = generateProduct();
      products.push(product);
    }
    await Product.create(products);
    res.json({ message: "Products generated successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
});
router.get("/", verify, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
});
router.patch("/addToCart/:id", verify, async (req, res) => {
  console.log("TRING TO ADD");
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");
    //check product already in cart and add
    const user = await User.find({
      _id: req.headers.user,
      cart: { $elemMatch: { productId: id } },
    });
    console.log(user);
    if (user.length > 0) throw new Error("Product already in cart");
    await User.updateOne({ $push: { cart: { productId: id } } });
    res.json({ message: "Product added to cart" });
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
});
router.patch("/RemoveFromCart", verify, async (req, res) => {
  try {
    console.log(req.body);
   const user= await User.updateOne(
      { _id: req.headers.user },
      { $pull: { cart: { productId: req.body.id } } },
      { new: true }
    );
    console.log("REMOVED",user);
    res.json({ message: "Product removed from cart" });
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
});
router.get("/getUserInfo", verify, async (req, res) => {
  try {
    const user = await User.findById(req.headers.user).populate({
      path: "cart.productId",
      model: "Product",
    });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json(err.message);
  }
});
router.get('/getCartItems',verify,async(req,res)=>{
  try{
    const user=await User.findById(req.headers.user).populate({
      path:'cart.productId',
      model:'Product'
    })
    res.json(user.cart);
  }catch(err){
    console.log(err);
    res.status(400).json(err.message);
  }
})
module.exports = router;
