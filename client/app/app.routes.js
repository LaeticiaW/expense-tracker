
angular.module('expense-tracker').config(['$stateProvider', '$urlRouterProvider',

    function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('app',{
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'app/header/header.html'
                    },
                    'content@': {
                        templateUrl: 'app/home/home.html',
                        controller: 'HomeController',
                        resolve: {
                            categories: retrieveCategories
                        }
                    }
                }
            })
            .state('app.categories', {
                url: '/categories',
                views: {
                    'content@': {
                        templateUrl: 'app/category/category.html',
                        controller: 'CategoryController',
                        resolve: {
                            categories: retrieveCategories
                        }
                    }
                }
            })
            .state('app.expenses', {
                url: '/expenses',
                views: {
                    'content@': {
                        templateUrl: 'app/expense/expense.html',
                        controller: 'ExpenseController',
                        resolve: {
                            categories: retrieveCategories
                        }

                    }
                }
            })
            .state('app.imports', {
                url: '/imports',
                views: {
                    'content@': {
                        templateUrl: 'app/import/import.html',
                        controller: 'ImportController',
                        resolve: {
                            categories: retrieveCategories,
                            categoryMappings: retrieveCategoryMappings
                        }
                    }
                }

            })
            .state('app.category-mappings', {
                url: '/category-mappings',
                views: {
                    'content@': {
                        templateUrl: 'app/category-mapping/category-mapping.html',
                        controller: 'CategoryMappingController',
                        resolve: {
                            categories: retrieveCategories
                        }
                    }
                }
            })
            .state('app.yearly-report', {
                url: '/report/yearly-report',
                views: {
                    'content@': {
                        templateUrl: 'app/report/yearly/yearly-report.html',
                        controller: 'YearlyReportController',
                        resolve: {
                            categories: retrieveCategories
                        }
                    }
                }
            })
            .state('app.monthly-report', {
                url: '/report/monthly-report',
                views: {
                    'content@': {
                        templateUrl: 'app/report/monthly/monthly-report.html',
                        controller: 'MonthlyReportController',
                        resolve: {
                            categories: retrieveCategories
                        }
                    }
                }
            })
            .state('app.summary-report', {
                url: '/report/summary-report',
                views: {
                    'content@': {
                        templateUrl: 'app/report/summary/summary-report.html',
                        controller: 'SummaryReportController',
                        resolve: {
                            categories: retrieveCategories
                        }
                    }
                }
            });
    }
]).run(['$rootScope', '$injector', 'toastr', function($rootScope, $injector, toastr) {

    // Handle ui router state change errors
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        event.preventDefault();
        toastr.error(error.statusText, "Expense Tracker Error");
    });
}]);

function retrieveCategories($q, Category) {
    return Category.query(function() {
        }, function(errorResponse) {
            console.log("Unable to retrieve categories");
            errorResponse.statusText = "Unable to retrieve categories";
            return $q.reject(errorResponse);
        }).$promise;
}

function retrieveCategoryMappings($q, CategoryMapping) {
    return CategoryMapping.query(function() {
        }, function(errorResponse) {
            console.log("Unable to retrieve category mappings");
            errorResponse.statusText = "Unable to retrieve category mappings";
            return $q.reject(errorResponse);
        }).$promise;
}
