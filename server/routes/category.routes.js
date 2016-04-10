var categoryController = require('../controllers/category.controller');

module.exports = function(app) {

    app.route('/category')
        .post(categoryController.create)
        .get(categoryController.list);

    app.route('/category/:categoryId')
        .get(categoryController.read)
        .put(categoryController.update)
        .delete(categoryController.delete)
        .post(categoryController.update);

    app.route('/category-name/:categoryName')
        .get(categoryController.isCategoryNameUnique);

    app.param('categoryId', categoryController.categoryById);
    app.param('categoryName', categoryController.categoryByName);
};
