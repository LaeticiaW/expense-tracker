var Report = require('mongoose').model('MonthlyExpenses');

exports.getSummaryExpenses = function(req, res, next) {

    Report.aggregate([
        {
            $project: {
                year: {$year: "$trxDate"},
                amount: "$amount"
            }
        },
        {
            $sort: {year: 1}
        },
        {
            $group: {
                _id: {year: "$year"},
                total: {$sum: "$amount"}
            }
        },
        {
            $sort: {_id: 1}
        }
    ], function(err, data) {
        if (err) {
            console.log("Server report controller getSummaryExpenses error:", err);
            return next(err);
        } else {
            var report = {};
            report.expenses = data;

            res.json(report);
        }

    });
};