const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Must provide a username"],
  },
  email: {
    type: String,
    required: [true, "Must provide a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Must provide a password"],
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "3d",
    }
  );
  return token;
};

const User = mongoose.model("User", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    // .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } 
    password: Joi.string()
      .required()
      .custom((pword, errorIdentifier) => {
        const ComplexityOptions = {
          min: 6, //?Minimum amount of characters: 8
          max: 20, //? maximum amount of characters: 20
          //?   lowerCase: 1, //? requires at least 1 lower case character
          // ?  upperCase: 1, //? requires at least 1 upper case character
          //?   numeric: 1, // ?requires at least 1 number
          // ?  symbol: 1, //? requires at least one special character
        };
        const complexitySchema = passwordComplexity(ComplexityOptions);
        const { error } = complexitySchema.validate(pword);
        if (error) {
          return errorIdentifier.error(error);
        }
        return pword;
      }),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
