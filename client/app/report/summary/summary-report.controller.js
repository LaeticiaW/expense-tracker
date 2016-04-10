angular.module('report').controller('SummaryReportController', ['$scope', '$http', 'ReportService',
    function($scope, $http, ReportService) {

        initialize();

        function initialize() {

            $scope.reportRows = [];

            getSummaryReportData();
        }

        function getSummaryReportData() {

                ReportService.getSummaryExpenses().then(
                function(data) {
                    $scope.reportRows = data.expenses;
                },
                function(response) {
                    console.log("Summary report error:", response);
                }
            );
        }
    }
]);