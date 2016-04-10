angular.module('category').factory('Category', ['$resource',
    function($resource) {
        return $resource('/category/:categoryId', {
            categoryId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            isCategoryNameUnique: {
                url: '/category-name/:categoryName',
                method: 'GET'
            }
        });
    }]);
