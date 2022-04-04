const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoStore = require('connect-mongo');
const flash = require('connect-flash');
const pageRouter = require('./routes/pageRoute');
const courseRouter = require('./routes/courseRoute');
const categoryRouter = require('./routes/categoryRoute');
const authRouter = require('./routes/userRoute');
const MongoStore = require('connect-mongo');
const app = express();
app.set('view engine', "ejs");

//connection
mongoose.connect('mongodb://localhost/smartedu-db', {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useFindAndModify:false,
    // useCreateIndex:true
}).then(() => {
    console.log('DB Connected');
}).catch((err) => {
    console.log('DB does not connection ', err);
});

//Global Variable
global.userIN = null;

//middlewares
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:'smart_edu_key',
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({mongoUrl: 'mongodb://localhost/smartedu-db'})
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});

app.use(methodOverride('_method', {
    methods:['POST', 'GET']
}));

// Routes
app.use('*', (req, res, next) => {
    userIN = req.session.userID;
    next();
});
app.use('/', pageRouter);

app.use('/courses', courseRouter);
app.use('/categories', categoryRouter);
app.use('/users', authRouter);

// Port and Listener
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Smart Edu project is starting on ${port} port`);
});