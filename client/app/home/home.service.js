angular.module('home').factory('HomeService', ['$http', '$q',

    function($http, $q) {

        return {
            getCategoryExpenses: function(year) {
                return $http.get('/report/category-expenses/' + year).then(function(result) {
                        return result.data;
                    }).catch(function(e) {
                        console.log('Unable to retrieve expense data:', e);
                        return $q.reject(e);
                    });
            }
        };

    }]);