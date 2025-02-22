const Product = require('./models/product');
const { productSchema, reviewSchema } = require('./schemas');
module.exports.isLoggedIn = (req, res, next) => {



    // console.log(req.xhr) // use to chk the request id ajax or not - coming from productapi.js
    if (req.xhr && !req.isAuthenticated()) { // by doning this we are chking the ajax request, if req is ajax then 1st IF will work else 2nd IF will work
        if(res.session.returnUrl){
            delete req.session.returnUrl
        }
        return res.status(401).json({ msg: 'you need to login 1st' })
    }
    else {
        req.session.returnUrl = req.originalUrl; // for persistent login     
        if (!req.isAuthenticated()) {
            req.flash('error', 'Login first')
            return res.redirect('/login')
        }
    }
    next();
}
module.exports.validateProduct = (req, res, next) => {
    const { name, img, desc, price } = req.body;
    const { error } = productSchema.validate({ name, img, price, desc });
    if (error) {
        const msg = error.details.map((err) => err.message).join(',')
        return res.render('error', { err: msg });
    }
    next();
}
module.exports.validateReview = (req, res, next) => {
    const { rating, comment } = req.body;
    const { error } = reviewSchema.validate({ rating, comment });
    if (error) {
        const msg = error.details.map((err) => err.message).join(',')
        return res.render('error', { err: msg });
    }
    next();
}
module.exports.isSeller = (req, res, next) => {
    if (!req.user || req.user.role === 'buyer') {
        req.flash('error', 'Your not a seller on my application, so if you want to sell the product signup as seller :<')
        return res.redirect('/products')
    }
    next()
}
module.exports.isProductAuthor = async (req, res, next) => {
    const { id } = req.params; // we are gettitng the product id as middleware have access to req,res so we can use req.params
    const product = await Product.findById(id)
    if (!(product.author && product.author.equals(req.user._id))) {
        req.flash('error', 'not a valid user to perform this operation')
        return res.redirect(`/products/${id}`)
    }
    next()
}