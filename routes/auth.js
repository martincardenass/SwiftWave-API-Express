const router = require("express").Router();
const { User } = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    //? const userName = await User.findOne({ username: req.body.username });
    if (!user) {
      return res
        .status(401)
        .send({
          message: "The email you entered isn't connected to an account.",
        });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res
        .status(401)
        .send({ message: "The password you’ve entered is incorrect." });
    }

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "Token is valid" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    // username: Joi.string().required().label('username'),
    email: Joi.string().email().required().label("email"),
    password: Joi.string().required().label("password"),
  });
  return schema.validate(data);
};

module.exports = router;
