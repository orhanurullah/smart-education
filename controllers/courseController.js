const Course = require("../models/Course");
const Category = require('../models/Category');
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const sessionUser = await User.findById(req.session.userID);
    if(sessionUser.role === 'teacher' || sessionUser.role === 'admin'){
      const course = await Course.create({
        name:req.body.name,
        description:req.body.description,
        category:req.body.category,
        user:sessionUser._id
      });
      req.flash('success', `${course.name} has been create successfully`);
      res.status(201).redirect('/users/dashboard');
    }
  } catch (err) {
    req.flash('error', `${course.name} hasn't been created successfully`);
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
exports.getAllCourses = async (req, res) => {
  try {
    const query = req.query.search;
    const categorySlug = req.query.categories;
    const category = await Category.findOne({slug:categorySlug});
    let filter = {};
    if(categorySlug){
      filter = {category:category._id};
    }
    if(query){
      filter = {name:query};
    }
    if(!query && !categorySlug){
      filter.name = "";
      filter.category = null;
    }
    const courses = await Course.find({
      $or:[
        {name : {
          $regex: '.*' + filter.name + ".*" , $options: 'i'
        }},
        {category:filter.category}
      ]
    }).sort('-createdAt').populate('user');
    const categories = await Category.find();
    res.status(200).render("courses", {
      page_name: "courses",
      courses,
      categories
    });
  } catch (err) {
    console.log("Courses does not get from database ", err);
    res.status(404).send('Courses does not found 404! ');
  }
};

exports.getSingleCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({slug:req.params.slug}).populate('user');
    const categories = await Category.find();
    res.status(200).render("course", {
      course,
      user,
      categories,
      page_name : "courses"
    });
  } catch (err) {
    console.log('Single course doesn"t found ', err);
    res.status(404).send("404! DATA Does not found");
  }
};

exports.enrollCourse = async (req, res) => {
  try{
    const user = await User.findById(req.session.userID);
    const course = await Course.findById(req.query.course);
    console.log('course => ', course);
    await user.courses.push({ _id: course._id});
    await user.save();
    res.status(201).redirect('/users/dashboard');
  }catch(err){
    res.status(400).send('can not save the course');
  }
};
exports.releaseCourse = async (req, res) => {
  try{
    const user = await User.findById(req.session.userID);
    const course = await Course.findById(req.query.course);
    await user.courses.pull({ _id: course._id});
    await user.save();
    res.status(201).redirect('/users/dashboard');
  }catch(err){
    res.status(400).send('can not delete the course');
  }
};
exports.deleteCourse = async (req, res) => {
  try{
    await Course.findOneAndRemove({slug:req.params.slug});
    req.flash('error', 'Course deleted successfully');
    res.status(201).redirect('/users/dashboard');
  }catch(err){
    req.flash('error', 'Course can not deleted');
    res.status(400).redirect('/dashboard');
  }
}
exports.updateCourse = async (req, res) => {
  try{
    const course = await Course.findOne({slug : req.params.slug});
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;
    course.save();

    req.flash('success', 'Course updated successfully');
    res.status(201).redirect('/users/dashboard');
  }catch(err){
    req.flash('error', 'Course can not updated yet');
    res.status(400).redirect('/users/dashboard');
  }
}
