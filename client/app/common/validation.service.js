angular.module('common').factory('ValidationService', function($http, $q) {
    return {
        getCategoryByName: function(category) {
            //since $http.get returns a promise,
            //and promise.then() also returns a promise
            //that resolves to whatever value is returned in it's
            //callback argument, we can return that.
            return $http.get('/category-name/' + category.name)
                .then(function(result) {
                    return result.data;
                })
                .catch(function(e) {
                    return $q.reject(e);
                });
            }
        };
});