
angular.module('report').controller('MonthlyReportController', ['$scope', '$http', 'ReportService', 'CommonService',
    function($scope, $http, ReportService, CommonService) {

        initialize();

        function initialize() {

            $scope.reportFilterYear = (new Date()).getFullYear();
            $scope.showSubcategories = true;
            $scope.reportRows = [];

            getMonthlyReportData($scope.reportFilterYear);
        }

        function getMonthlyReportData(year) {

            ReportService.getMonthlyExpenses(year).then(function(data) {
                $scope.reportRows = data.expenses;
                $scope.reportMonthlyTotals = data.monthlyTotals;
                $scope.reportYearlyTotal = data.yearlyTotal;
            }).catch(function(e) {
                console.log("Monthly report error:", e);
            });

        }

        $scope.filterChanged = function() {

            if (CommonService.isYearValid($scope.reportFilterYear)) {
                getMonthlyReportData($scope.reportFilterYear);
            }
        };

    }
]);