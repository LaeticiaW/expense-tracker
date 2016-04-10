
angular.module('home').controller('HomeController', ['$scope', '$http', 'HomeService', 'CommonService', 'categories',
    function($scope, $http, HomeService, CommonService, categories) {

        initialize();

        function initialize() {

            $scope.categories = categories;
            $scope.categoriesExist = true;
            $scope.reportFilterYear = (new Date()).getFullYear();

            getSpendingData($scope.reportFilterYear);
        }

        function getSpendingData(year) {

            HomeService.getCategoryExpenses(year).then(
                function(data) {

                    $scope.categories = [];

                    data.categories.forEach(function(cat) {
                        if (cat !== null) {
                            $scope.categories.push(cat.name);
                        }
                    });

                    $scope.percentages = data.percentages;

                    $scope.chartOptions = {
                        animation: false,
                        tooltipTemplate: "<%=label%>: <%=value%>%"
                    };

                    $scope.categoriesExist = $scope.categories.length;
                },
                function(response) {
                    console.log("Client report controller, error:", response);
                }
            );
        }

        $scope.filterChanged = function() {
            if (CommonService.isYearValid($scope.reportFilterYear)) {
                getSpendingData($scope.reportFilterYear);
            }
        };

    }
]);