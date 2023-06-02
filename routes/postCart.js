const router = require("express").Router();
const { User } = require("../models/user");

router.patch("/", async (req, res) => {
  try {
    const id = req.body.id
    const newCart = {
      cart: req.body.cart,
    //   userId: req.body._id,
    //   username: req.body.username,
    //   email: req.body.email,
    };
    const cart = await User.findOneAndUpdate({ _id: id }, newCart, {
      new: true,
    });
    res.status(201).send(cart);
  } catch (error) {
    res.status(500).json({ msg: "Error", error });
  }
});

module.exports = router;