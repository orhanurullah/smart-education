const Category = require('../models/Category');
exports.createCategory = async (req, res) => {
    try{
        const category = await Category.create(req.body);
        res.status(201).json({
            status:"success",
            category
        });
    }catch(err){
        res.status(404).json({
            status:"fail",
            err
        });
    }
};

exports.getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find();
        res.status(200).json({
            status:"success",
            categories
        });
    }catch(err){
        res.status(404).json({
            status:"fail",
            err
        });
    }
};

exports.getCategory = async (req, res) => {
    try{
        const category = await Category.findOne({slug:req.params.slug});
        res.status(200).json({
            status:"success",
            category
        });
    }catch(err){
        res.status(404).json({
            status:"fail",
            err
        });
    }
};