var Report = require('mongoose').model('MonthlyExpenses'),
    Category = require('mongoose').model('Category');

exports.getCategoryExpenses = function(req, res, next) {

    var reportYear = parseInt(req.params.reportYear);

    Report.aggregate([
        {
            $match: {
                trxYear: reportYear
            }
        },
        {
            $project: {
                category: "$categoryId",
                amount: "$amount"
            }
        },
        {
            $sort: {category: 1}
        },
        {
            $group: {
                _id: {category: "$category"},
                total: {$sum: "$amount"}
            }
        },
        {
            $sort: {_id: 1}
        }
    ], function(err, result) {
        if (err) {
            console.log("Server report controller getCategoryExpenses error:", err);
            return next(err);
        } else {
            Category.populate(result, {path: "_id.category"}, function(err, data) {

                if (err) {

                    console.log("Error populating category in home controller:", err);
                    return next(err);

                } else {

                    var report = {};
                    report.expenses = [];
                    report.yearlyTotal = 0;
                    report.categories = [];
                    report.percentages = [];

                    // Calculate spending total for the year
                    data.forEach(function(expense) {
                        report.yearlyTotal += expense.total;
                        report.expenses.push(expense);
                    });

                    // Calculate category spending percentages
                    report.expenses.forEach(function(expense) {
                        expense.percentage = ((expense.total / report.yearlyTotal) * 100).toFixed(2);
                        report.categories.push(expense._id.category);
                        report.percentages.push(expense.percentage);
                    });

                    res.json(report);
                }
            });
        }

    });
};