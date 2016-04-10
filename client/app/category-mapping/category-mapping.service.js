angular.module('categoryMapping').factory('CategoryMapping', ['$resource',
    function($resource) {
        return $resource('/category-mapping/:categoryMapId', {
            categoryMapId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }]);