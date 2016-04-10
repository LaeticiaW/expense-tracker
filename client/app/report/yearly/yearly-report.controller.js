
angular.module('report').controller('YearlyReportController', ['$scope', '$http', 'ReportService', 'categories',
    function($scope, $http, ReportService, categories) {

        initialize();

        function initialize() {

            $scope.categories = categories;
            $scope.showSubcategories = true;
            $scope.reportRows = [];

            getYearlyReportData();
        }

        function getYearlyReportData() {

            ReportService.getYearlyExpenses().then(
                function(data) {
                    $scope.reportRows = data.expenses;
                    $scope.reportYears = data.reportYears;
                    $scope.yearlyTotals = data.yearlyTotals;
                },
                function(response) {
                    console.log("Yearly report error:", response);
                }
            );
        }

    }
]);
