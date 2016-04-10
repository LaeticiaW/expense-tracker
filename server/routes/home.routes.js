var homeController = require('../controllers/home.controller');    

module.exports = function(app) {
   
    app.route('/report/category-expenses/:reportYear')        
        .get(homeController.getCategoryExpenses);
    
};
