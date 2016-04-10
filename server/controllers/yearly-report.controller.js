var Report = require('mongoose').model('MonthlyExpenses'),
    Category = require('mongoose').model('Category');

exports.getYearlyExpenses = function(req, res, next) {

    Report.aggregate([
        {
            $project: {
                year: {$year: "$trxDate"},
                category: "$categoryId",
                subcategory: "$subcategory",
                amount: "$amount"
            }
        },
        {
            $sort: {category: 1, subcategory: 1, year: 1}
        },
        {
            $group: {
                _id: {category: "$category", subcategory: "$subcategory", year: "$year"},
                total: {$sum: "$amount"}
            }
        },
        {
            $sort: {_id: 1}
        },
        {
            "$group": {
                "_id": {category: "$_id.category", subcategory: "$_id.subcategory"},
                "years": {
                    "$push": {
                        "year": "$_id.year",
                        "yearTotal": "$total"
                    }
                }
            }
        },
        {
            $sort: {_id: 1}
        }
    ], function(err, result) {
        if (err) {
            console.log("Server report controller getYearlyExpenses error:", err);
            return next(err);
        } else {

            Category.populate(result, {path: "_id.category"}, function(err, data) {

                if (err) {
                    console.log("Server report controller getMonthlyExpenses populate error:", err);
                } else {

                    var currentCategory = '',
                        categoryExpense,
                        minYear = 9999,
                        maxYear = 0,
                        report = {},
                        yr;

                    report.expenses = [];
                    report.yearlyTotals = {};
                    report.reportYears = [];

                    // Find the min and max years
                    data.forEach(function(expense) {
                        expense.years.forEach(function(yearObj) {
                            if (yearObj.year < minYear) { minYear = yearObj.year; }
                            if (yearObj.year > maxYear) { maxYear = yearObj.year; }
                        });
                    });

                    for (yr = minYear; yr <= maxYear; yr++) {
                        report.reportYears.push(yr);
                        report.yearlyTotals[yr] = 0;
                    }

                    // Convert years array to a hash/map
                    data.forEach(function(expense) {

                        if (expense._id.category.name !== currentCategory.name) {
                            currentCategory = expense._id.category;

                            categoryExpense = {
                                _id: {
                                    category: currentCategory,
                                    subcategory: ''
                                },
                                yearMap: {},
                                yearTotal: 0,
                                isCategoryRow: true
                            };

                            report.expenses.push(categoryExpense);

                            for (yr = minYear; yr <= maxYear; yr++) {
                               categoryExpense.yearMap[yr] = 0;
                            }
                        }

                        report.yearlyTotal += expense.yearTotal;
                        categoryExpense.yearTotal += expense.yearTotal;

                        expense.isCategoryRow = false;
                        expense.yearMap = {};

                        expense.years.forEach(function(yearObj) {
                            expense.yearMap[yearObj.year] = yearObj.yearTotal;
                            categoryExpense.yearMap[yearObj.year] += yearObj.yearTotal;
                        });

                        for (yr = minYear; yr <= maxYear; yr++) {
                            if (!expense.yearMap[yr]) {
                                expense.yearMap[yr] = 0;
                            }
                           report.yearlyTotals[yr] += expense.yearMap[yr];
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