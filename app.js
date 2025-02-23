if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}



const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session')

const passport = require('passport')
const flash = require('connect-flash')
const app = express();
const LocalStrategy = require('passport-local')
const User = require("./models/user")
const MongoStore = require('connect-mongo')


mongoose.connect(`${process.env.dbUrl}`)
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));



app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


const store = MongoStore.create({ // are session will store in sessions collection in db 
    secret: process.env.secret || "some top level secret:>",
    mongoUrl:process.env.dbUrl,
    touchAfter: 24 * 3600, // one day

})


const sessionConfig = {
    store,
    secret: process.env.secret || "some top level secret:>",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 1),
        maxAge: 1000 * 60 * 60 * 24 * 7 * 1
    }
}


app.use(session(sessionConfig))
app.use(flash())




app.use(passport.initialize())
app.use(passport.session())




// adding the user in session 
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());




passport.use(new LocalStrategy(User.authenticate()));// this authenticate function is add in our User model by passport-local-mongoose like it added username and password(hash)// this function will chk the username and password we provide in our database 





app.use((req, res, next) => { // adding success and error globally now available to req and res & this success and error are automaticallly availablr to all the templates and we can use it like this - <%= success %> or  <%= error %> 
 
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')

    res.locals.currentUser = req.user 
    next();
})
// Routes
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const productApi = require('./routes/api/productapi');




app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(productApi);
app.use(cartRoutes);


app.get('/', (req, res) => {
    res.render('home')
})


const port = 4000;

app.listen(port, () => {
    console.log(`server running at port ${port}`);
});