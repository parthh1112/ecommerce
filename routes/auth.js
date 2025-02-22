const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')


// router.get('/fakeUser', async (req, res) => {
//     const user = {
//         email: 'parth@gmail.com',
//         username: 'parth'
//     };
//     let userData = await User.register(user, "1234");
//     res.send(userData)
// })


router.get('/register', (req, res) => {
    res.render('auth/signup')
})

router.post('/register', async (req, res) => {
    try {


        const { email, username, password, role } = req.body
        const user = new User({ username, email, role });
        const newUser = await User.register(user, password);

        req.login(newUser, function (err) {
            if (err) return next(err)

            req.flash('success', "Registered success and login to your account successfully")
            return res.redirect('/products')
        })
    } catch (error) {
        req.flash('error', "Some error occur while registering you :<")
        return res.redirect('/register')
    }

})



router.get('/login', (req, res) => {
    res.render('auth/login')
})




router.post('/login',
    (req, res, next) => {
        req.tempReturnUrl = req.session.returnUrl; // we are preventing the session to get deleted by adding this middelware, we need the session for persistent login 
        next();
    },
    passport.authenticate('local', {// middleware for authenticate
        failureRedirect: '/login',
        failureFlash: true
    }), (req, res) => {
        // console.log(req.user) // when we are login successfull passport add .user in req 
        req.session.returnUrl = req.tempReturnUrl // here we are aading the previous link for persistent login 
        req.flash('success', `wellcome back again ${req.user.username}`)
        console.log(req.session)
        let redirectUrl = req.session.returnUrl || '/products'
        if (redirectUrl && redirectUrl.indexOf('review') !== -1) {
            redirectUrl.split('/')
            redirectUrl.pop();
            redirectUrl = returnUrl.join('/')
        }
        delete req.session.returnUrl
        res.redirect(redirectUrl)
    })





router.get('/logout', (req, res) => {
    req.logout(function (err) {  // <-- Add the callback function
        if (err) {
            // Handle the error, e.g., redirect to an error page
            return res.redirect('/error'); // Example
        }

        req.flash('success', 'Logout success')
        res.redirect('/products')
    });
});

module.exports = router




