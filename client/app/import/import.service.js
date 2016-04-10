
angular.module('import').factory('ImportService', ['$http', '$q',

    function($http, $q) {

        return {
            insertExpenses: function(expenses) {

                var data = { expenses: expenses };

                return $http.post('/import/', data).then(function() {
                        console.log("ImportService Success");
                    }).catch(function(e) {
                        console.log("ImportService Error:", e);
                        return $q.reject(e);
                    });
            }
        };

    }]);
