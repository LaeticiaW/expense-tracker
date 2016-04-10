var monthlyReportController = require('../controllers/monthly-report.controller'), 
    yearlyReportController = require('../controllers/yearly-report.controller'),
    summaryReportController = require('../controllers/summary-report.controller');

module.exports = function(app) {
   
    app.route('/report/monthly-expenses/:reportYear')        
        .get(monthlyReportController.getMonthlyExpenses);

    app.route('/report/yearly-expenses')        
        .get(yearlyReportController.getYearlyExpenses);

    app.route('/report/summary-expenses')        
        .get(summaryReportController.getSummaryExpenses);
     
};
