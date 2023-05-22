const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      const errorMsg = error.details.map((error) =>
      error.message
      .replace(/\"/g, "").replace('email must be a valid email', 'Please provide a valid email address')
      .replace('Error code ValidationError: value', 'Password')
      .replace(' is not defined, your custom type is missing the correct messages definition', '')
      ); //! Might not be the best solution, but it works

      // ?.replace('lowercase', 'Password must contain at least one lowercase character')
      // ?.replace('uppercase', 'Passowrd must containt at least one uppercase character')
      // ?.replace('numeric', 'Passwords must contain at least one number')
      // ?.replace('symbol', 'Passwords must contain at lesat one special character (@#$ ^&*, etc)')
      // ?const errorMessageJoined = errorMesssage.join(', ')
      return res.status(400).send({ message: errorMsg });
      // ?return res.status(400).send({ message: error.details[0].type.details });
      // ?const errorMessage = error.details[0].type.details.map(error => error.message);
      // ?return res.status(400).send({message: errorMessage});
    }
    const user = await User.findOne({ email: req.body.email });
    const userName = await User.findOne({ username: req.body.username });
    if (user) {
      return res.status(409).send({ message: "Email already in use" });
    }
    if (userName) {
      return res.status(409).send({ message: "Username already in use" });
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);

    await new User({ ...req.body, password: hash }).save();
    res.status(201).send({ message: "User created" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
