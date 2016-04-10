var Report = require('mongoose').model('MonthlyExpenses'),
    Category = require('mongoose').model('Category');

exports.getMonthlyExpenses = function(req, res, next) {

    var reportYear = parseInt(req.params.reportYear);

    Report.aggregate([
        {
            $match: {
                trxYear: reportYear
            }
        },
        {
            $project: {
                month: {$month: "$trxDate"},
                category: "$categoryId",
                subcategory: "$subcategory",
                amount: "$amount"
            }
        },
        {
            $sort: {category: 1, subcategory: 1, month: 1}
        },
        {
            $group: {
                _id: {category: "$category", subcategory: "$subcategory", month: "$month"},
                total: {$sum: "$amount"}
            }
        },
        {
            $sort: {_id: 1}
        },
        {
            "$group": {
                "_id": {category: "$_id.category", subcategory: "$_id.subcategory"},
                "months": {
                    "$push": {
                        "month": "$_id.month",
                        "monthTotal": "$total"
                    }
                },
                "yearTotal": { "$sum": "$total" }
            }
        },
        {
            $sort: {_id: 1}
        }
    ], function(err, result) {

        if (err) {
            console.log("Server report controller getMonthlyExpenses error:", err);
            return next(err);
        } else {

            Category.populate(result, {path: "_id.category"}, function(err, data) {

                if (err) {
                    console.log("Server report controller getMonthlyExpenses POPULATE error:", err);
                } else {

                    var currentCategory = '',
                        report = {},
                        categoryExpense;

                    report.expenses = [];
                    report.yearlyTotal = 0;
                    report.monthlyTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    report.yearlyCategoryTotal = 0;

                    // Convert months array to a hash/map
                    data.forEach(function(expense) {

                        if (expense._id.category.name !== currentCategory.name) {

                            currentCategory = expense._id.category;

                            categoryExpense = {
                                _id: {
                                    category: currentCategory,
                                    subcategory: ''
                                },
                                yearTotal: 0,
                                isCategoryRow: true,
                                monthMap: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                            };

                            report.expenses.push(categoryExpense);
                        }

                        categoryExpense.yearTotal += expense.yearTotal;
                        report.yearlyTotal += expense.yearTotal;

                        expense.isCategoryRow = false;
                        expense.monthMap = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                        expense.months.forEach(function(monthObj) {
                            expense.monthMap[monthObj.month - 1] = monthObj.monthTotal;
                            categoryExpense.monthMap[monthObj.month - 1] += monthObj.monthTotal;
                        });

                        for (var i = 0; i < 12; i++) {
                            report.monthlyTotals[i] += expense.monthMap[i];
                        }

                        report.expenses.push(expense);
                    });

                    report.expenses.sort(function(exp1, exp2) {
                        if (exp1._id.category.name > exp2._id.category.name) {
                            return 1;
                        } else if (exp1._id.category.name < exp2._id.category.name) {
                            return -1;
                        } else {
                            if (exp1._id.subcategory > exp2._id.subcategory) {
                                return 1;
                            } else if (exp1._id.subcategory < exp2._id.subcategory) {
                                return -1;
                            } else {
                                return 0;
                            }
                        }
                    });

                    res.json(report);
                }
            });
        }

    });
};