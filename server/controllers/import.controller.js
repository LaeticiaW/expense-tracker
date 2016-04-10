
var ExpenseModel = require('mongoose').model('ExpenseModel');

exports.importSpending = function(req, res, next) {

    req.body.expenses.forEach(function(expense) {

        expense.trxDate = new Date(expense.trxDate);
        expense.trxYear = expense.trxDate.getFullYear();
        expense.trxMonth = expense.trxDate.getMonth();
    });

    ExpenseModel.create(req.body.expenses, function(err, expenses) {
       if (err) {
            console.log("importSpending error:", err);
            return next(err);
        } else {
            res.json(expenses);
        }
    });

};