var importController = require('../controllers/import.controller');

module.exports = function(app) {

    app.route('/import/')
        .post(importController.importSpending);

};
