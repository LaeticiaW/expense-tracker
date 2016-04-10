var CategoryMapping = require('mongoose').model('CategoryMapping');

exports.create = function(req, res, next) {

    var mapping = new CategoryMapping(req.body);

    mapping.save(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(mapping);
        }
    });
};

exports.list = function(req, res, next) {

    CategoryMapping.find({}, function(err, mappings) {
        if (err) {
            return next(err);
        } else {
            res.json(mappings);
        }
    });
};

exports.read = function(req, res) {

    res.json(req.categoryMapping);
};

exports.categoryMappingById = function(req, res, next, id) {

    CategoryMapping.findOne({_id: id}, function(err, mapping) {
        if (err) {
            return next(err);
        } else {
            req.categoryMapping = mapping;
            next();
        }
    });
};

exports.update = function(req, res, next) {

    var mapping = new CategoryMapping(req.body);

    CategoryMapping.findByIdAndUpdate(req.categoryMapping.id, mapping, function(err, mapping) {
        if (err) {
            console.log("Server mapping controller update error: ", err);
            return next(err);
        } else {
            res.json(mapping);
        }
    });
};

exports.delete = function(req, res, next) {

    req.categoryMapping.remove(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.categoryMapping);
        }
    });
};
