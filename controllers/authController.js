const User = require("../models/User");
const session = require('express-session');
const bcrypt = require("bcrypt");
const { validationResult } = require('express-validator');
const Category = require("../models/Category");
const Course = require("../models/Course");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect('/login');
  } catch (err) {
    const errors = validationResult(req);
    for(let i = 0; i < errors.array().length; i++){
      req.flash('error', `${errors.array()[i].msg}`);

    }    
    res.status(400).redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email:email});
    if(user) {
        bcrypt.compare(password, user.password, (err, same) => {
            if(same){ 
                req.session.userID = user._id;
                res.status(200).redirect('/users/dashboard');
            }else{
              req.flash('error', 'Your password is not correct!');
                res.status(419).redirect('/login');
            }
        });
    }else{
      req.flash('error', 'Your email is not found! You can register');
        res.status(400).redirect('/login');
    }
  }catch (err) {
    console.log("There is a warning! ", err);
    res.status(400).send("There is a warning!");
  }
};

exports.logoutUser = async (req, res) => {
    console.log(`${req.session.userID} id'li User is log out this page`);
    req.session.destroy(() => {
        res.redirect('/');
    })
};

exports.getDashboardPage = async (req, res) => {
    const user = await User.findOne({_id:req.session.userID}).populate('courses');
    const categories = await Category.find({});
    const courses = await Course.find({user: user._id}).sort('-createdAt');
    res.status(200).render('dashboard', {
        page_name : "dashboard",
        user,
        categories,
        courses
    });
};
