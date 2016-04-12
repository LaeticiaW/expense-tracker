var ExpenseModel = require('mongoose').model('ExpenseModel');

exports.create = function(req, res, next) {

    var expense = new ExpenseModel(req.body);

    expense.trxYear = expense.trxDate.getFullYear();
    expense.trxMonth = expense.trxDate.getMonth();

    expense.save(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(expense);
        }
    });
};

exports.list = function(req, res, next) {

    var querySelector = {};

    if (req.query.categoryId !== '-1') {
        querySelector.categoryId = req.query.categoryId;
    }

    if (req.query.fromDate && req.query.toDate) {
        querySelector.trxDate = { $gte: req.query.fromDate, $lte: req.query.toDate };
    }

    ExpenseModel.find(querySelector, function(err, expenses) {
        if (err) {
            return next(err);
        } else {
            console.log("Server retrieved expense, number=", expenses.length);
            res.json(expenses);
        }
    });
};

exports.read = function(req, res) {

    res.json(req.expense);
};

exports.expenseById = function(req, res, next, id) {

    ExpenseModel.findOne({_id: id}, function(err, expense) {
        if (err) {
            return next(err);
        } else {
            req.expense = expense;
            next();
        }
    });
};

exports.update = function(req, res, next) {

    var expense = new ExpenseModel(req.body);

    expense.trxYear = expense.trxDate.getFullYear();
    expense.trxMonth = expense.trxDate.getMonth();

    ExpenseModel.findByIdAndUpdate(req.expense.id, expense, function(err, expense) {
        if (err) {
            console.log("Server expense controller update error: ", err);
            return next(err);
        } else {
            res.json(expense);
        }
    });
};

exports.delete = function(req, res, next) {

    req.expense.remove(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(req.expense);
        }
    });
};

exports.isCategoryInUse = function(req, res, next) {

    ExpenseModel.findOne({categoryId: req.params.categoryId}, function(err, expense) {

        if (err) {
            console.log("Server, err:", err);
            return next(err);
        } else {
            if (expense) {
                res.json({isCategoryInUse: true});
            } else {
                res.json({isCategoryInUse: false});
            }
            next();
        }
    });
};
