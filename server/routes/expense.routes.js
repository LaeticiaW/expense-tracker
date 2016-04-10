var expenseController = require('../controllers/expense.controller');

module.exports = function(app) {

    app.route('/expense')
        .post(expenseController.create)
        .get(expenseController.list);

    app.route('/expense/:expenseId')
        .get(expenseController.read)
        .put(expenseController.update)
        .delete(expenseController.delete)
        .post(expenseController.update);

    app.route('/expense-usage/:categoryId')
        .get(expenseController.isCategoryInUse);

    app.param('expenseId', expenseController.expenseById);
};
