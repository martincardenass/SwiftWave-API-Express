const router = require("express").Router();
const { User } = require('../models/user')

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId);
        res.status(200).send({cart: user.cart})
    } catch (error) {
        res.status(500).json({ msg: "Error", error });
    }
})

module.exports = router;