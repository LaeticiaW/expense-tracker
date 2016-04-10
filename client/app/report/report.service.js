angular.module('report').factory('ReportService', ['$http', '$q',

    function($http, $q) {

        return {
            getMonthlyExpenses: function(year) {

                return $http.get('/report/monthly-expenses/' + year).then(function(result) {
                    return result.data;
                }).catch(function(e) {
                    console.log("Error retrieving monthly expenses:", e);
                    return $q.reject(e);
                });
            },

            getYearlyExpenses: function() {

                return $http.get('/report/yearly-expenses/').then(function(result) {
                    return result.data;
                }).catch(function(e) {
                    console.log("Error retrieving yearly expenses:", e);
                    return $q.reject(e);
                });
            },

            getSummaryExpenses: function() {

                return $http.get('/report/summary-expenses/').then(function(result) {
                    return result.data;
                }).catch(function(e) {
                    console.log("Error retrieving summary expenses:", e);
                    return $q.reject(e);
                });
            }
        };

    }]);