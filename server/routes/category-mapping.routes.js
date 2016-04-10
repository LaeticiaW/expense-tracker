var categoryMappingController = require('../controllers/category-mapping.controller');

module.exports = function(app) {

    app.route('/category-mapping')
        .post(categoryMappingController.create)
        .get(categoryMappingController.list);

    app.route('/category-mapping/:categoryMappingId')
        .get(categoryMappingController.read)
        .put(categoryMappingController.update)
        .delete(categoryMappingController.delete)
        .post(categoryMappingController.update);

    app.param('categoryMappingId', categoryMappingController.categoryMappingById);
};
