# SwiftWave-Expressjs-backend
(NodeJS, ExpressJS, Mongo, React)
#### You can read more in the SwiftWave Vite React repository

## Key Features:

 **Multer for image upload:** implementing Multer  middleware for uploading files, which is useful to upload images through the frontend from a file input
 ```
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("image");
```
 
 **joi-password-complexity:**  used for secure passwords. Throws an error when conditions are not met, forcing the user to choose a safer password

```
    password: Joi.string()
      .required()
      .custom((pword, errorIdentifier) => {
        const ComplexityOptions = {
          min: 6, // Minimum amount of characters: 8
          max: 20, // Maximum amount of characters: 20
          //   lowerCase: 1, // requires at least 1 lower case character
          //   upperCase: 1, // requires at least 1 upper case character
          //   numeric: 1, // requires at least 1 number
          //   symbol: 1, // requires at least one special character
        };
        const complexitySchema = passwordComplexity(ComplexityOptions);
        const { error } = complexitySchema.validate(pword);
        if (error) {
          return errorIdentifier.error(error);
        }
        return pword;
      }),
```

**bcrypt:** encrypting users password and storing them in the database

*Encrypting the password and storing the new user in the database:*
```
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);

    await new User({ ...req.body, password: hash }).save();
```
*Decrypting the password and generating a user token if password/username combination is correct:*
```
 const user = await User.findOne({ email: req.body.email });
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
    const userId = user._id
    res.status(200).send({data:{ token, userId }, message: "Token is valid"});
```

**Creation of users model which includes a cart, used to store the selected shopping items in the database:** It receives a simple JSON object with the items that have been added, and it stores it to the currently logged in user.
```
    const id = req.body.id
    const newCart = {
      cart: req.body.cart,
    };
    const cart = await User.findOneAndUpdate({ _id: id }, newCart, {
      new: true,
    });
    res.status(201).send(cart);
```
