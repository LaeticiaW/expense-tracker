var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);

    require('../models/category.model');
    require('../models/expense.model');
    require('../models/monthly-expenses.model');
    require('../models/category-mapping.model');

    return db;
};

