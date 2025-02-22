const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('../../middleware')
const User = require('../../models/user')
router.post('/product/:productid/like', isLoggedIn, async (req, res) => {
    const { productid } = req.params
    // grab the current login user
    const user = req.user
    const isLiked = user.wishList.includes(productid)
    const option = isLiked ? '$pull' : '$addToSet';
    req.user = await User.findByIdAndUpdate(req.user._id, { [option]: { wishList: productid } }, { new: true });
    res.send('LIKE API');
})
module.exports = router 