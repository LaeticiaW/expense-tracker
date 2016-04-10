var Category = require('mongoose').model('Category');

exports.create = function(req, res, next) {

    var category = new Category(req.body);
    category.save(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(category);
        }
    });
};

exports.list = function(req, res, next) {

    Category.find({}, function(err, categories) {
        if (err) {
            console.log("Server category controller list error: ", err);
            return next(err);
        } else {
            res.json(categories);
        }
    });
};

exports.read = function(req, res) {

    res.json(req.category);
};

exports.categoryById = function(req, res, next, id) {

    Category.findOne({_id: id}, function(err, category) {
        if (err) {
            return next(err);
        } else {
            req.category = category;
            next();
        }
    });
};

exports.categoryByName = function(req, res, next, name) {

    Category.findOne({name: {$regex : new RegExp(name, "i")}}, function(err, category) {
        if (err) {
            return next(err);
        } else {
            req.category = category;
            next();
        }
    });
};

exports.update = function(req, res, next) {

    Category.findByIdAndUpdate(req.category.id, req.body, function(err, category) {
        if (err) {
            console.log("Server controller update error: ", err);
            return next(err);
        } else {
            res.json(category);
        }
    });
};

exports.delete = function(req, res, next) {

    req.category.remove(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.category);
        }
    });
};

exports.isCategoryNameUnique = function(req, res) {

    if (req.category && req.category._id) {
        res.json({isCategoryNameUnique: false});
    } else {
        res.json({isCategoryNameUnique: true});
    }
};
