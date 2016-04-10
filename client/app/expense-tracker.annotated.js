
retrieveCategories.$inject = ["$q", "Category"];
retrieveCategoryMappings.$inject = ["$q", "CategoryMapping"];angular.module('expense-tracker').config(["toastrConfig", function(toastrConfig) {

    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: true,
        target: 'body',
        allowHtml: true,
        closeButton: true,
        closeHtml: '<button>&times;</button>',
        extendedTimeOut: 1000,
        iconClasses: {
          error: 'toast-error',
          info: 'toast-info',
          success: 'toast-success',
          warning: 'toast-warning'
        },
        messageClass: 'toast-message',
        onHidden: null,
        onShown: null,
        onTap: null,
        progressBar: false,
        tapToDismiss: true,
        templates: {
          toast: 'directives/toast/toast.html',
          progressbar: 'directives/progressbar/progressbar.html'
        },
        timeOut: 5000,
        titleClass: 'toast-title',
        toastClass: 'toast'
    });
}]);

angular.module('expense-tracker').config(["$provide", function($provide) {

    $provide.decorator('$exceptionHandler', ["$delegate", "$injector", function($delegate, $injector) {
        return function(exception, cause) {
            console.log("Exception Handler:", exception, cause);
            $delegate(exception, cause);
            var msg = "An unexpected error occurred";
            console.log("typeof exception=", typeof exception);
            if (typeof exception === 'string') {
                msg = exception;
            } else if (typeof exception === 'object') {
                if (exception.msg) {
                    msg = exception.msg;
                }
            }
            $injector.get('toastr').error(msg, "Expense Tracker Error");
        };
    }]);
}]);

angular.module('expense-tracker').config(["$httpProvider", function($httpProvider) {

     $httpProvider.interceptors.push(["$q", "$injector", function($q, $injector) {
        return {
          responseError: function(errorResponse) {
                var msg = errorResponse.statusText ? errorResponse.statusText : "The server is unavailable";
                $injector.get('toastr').error(msg, "Expense Tracker HTTP Error");
                return $q.reject(errorResponse);
            }
        };
    }]);
}]);

angular.module('expense-tracker').run(function() {

    // Fix bug in Bootstrap so that mobile navbar collapses after clicking link
    $(document).on('click','.navbar-collapse.in', function(e) {
        if ($(e.target).is('a')) {
            $(this).collapse('hide');
        }
    });
});

angular.module('expense-tracker').run(["confirmationPopoverDefaults", function(confirmationPopoverDefaults) {

  confirmationPopoverDefaults.confirmText = 'OK';
  confirmationPopoverDefaults.cancelText = 'Cancel';
  confirmationPopoverDefaults.placement = 'top';
  confirmationPopoverDefaults.confirmButtonType = 'primary';
  confirmationPopoverDefaults.cancelButtontype = 'default';
}]);

angular.module('expense-tracker', ['ui.router', 'ui.bootstrap', 'toastr',
               'home', 'category', 'expense', 'import', 'categoryMapping', 'report']);

angular.module('expense-tracker').constant('Papa', Papa);


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


angular.module('categoryMapping').controller('CategoryMappingController', ['$scope', '$http', 'CategoryMapping',
    'categoryMappingFilter', 'CommonService', 'categories',

    function($scope, $http, CategoryMapping, categoryMappingFilter, CommonService, categories) {

        initialize();

        function initialize() {

            CategoryMapping.query(function(categoryMappings) {

                $scope.categories = categories;
                $scope.mappings = categoryMappings;

                $scope.editing = false;
                $scope.focusTransactionInput = true;
                $scope.subcategories = [];

                $scope.sort = {
                    property: 'category',
                    subProperty: 'name',
                    direction: 'ascending',
                    type: 'string'
                };

                $scope.mappingFilterCategory = 'all';

                CommonService.addCategoryToArray($scope.mappings, $scope.categories, 'category');

                $scope.filteredMappings = categoryMappingFilter($scope.mappings, $scope.mappingFilterCategory);

                CommonService.sortObjectArray($scope.filteredMappings, $scope.sort);
            },
            function(errorResponse) {
                console.log("categorymapping query error", errorResponse);
            });
        }

        $scope.find = function() {

            $scope.mappings = CategoryMapping.query();
        };

        $scope.addMapping = function() {

            if (!$scope.mappings) {
                $scope.mappings = [];
            }

            if ($scope.editing) {
                resetMappings();
            }

            if (!$scope.editing) {
                $scope.mappings.unshift({
                    searchText: '',
                    category: '',
                    subcategory: '',
                    mode: 'edit',
                    state: 'add'
                });
            }
            $scope.editing = true;
            $scope.subcategories = [];

            $scope.filterMappings();
        };

        $scope.editMapping = function(mapping) {

            var items;

            if ($scope.editing) {
                resetMappings();
            }

            mapping.mode = 'edit';
            mapping.state = '';

            $scope.editing = true;
            $scope.subcategories = [];

            items = mapping.selectedCategory = $scope.categories.filter(function(cat) {
                return (cat._id === mapping.category._id);
            });
            mapping.selectedCategory = items.length ? items[0] : '';

            if (mapping.selectedCategory) {
                $scope.subcategories = mapping.selectedCategory.subcategories;
                items = $scope.subcategories.filter(function(subcat) {
                    return subcat.name === mapping.subcategory;
                });
                mapping.selectedSubcategory = items.length ? items[0] : '';
            }
        };

        $scope.saveMapping = function(mapping) {

            mapping.category = mapping.selectedCategory;
            mapping.subcategory = mapping.selectedSubcategory.name;

            // validate

            var map = new CategoryMapping(mapping);

            if (mapping.state === 'add') {
                map.$save(function(response) {
                    angular.copy(response, mapping);
                    CommonService.addCategory(mapping, $scope.categories, 'category');
                }, function(errorResponse) {
                    console.log("CategoryMapping save failed: ", errorResponse);
                });
            } else {
                map.$update(function() {
                }, function(errorResponse) {
                    console.log("CategoryMapping update failed: ", errorResponse);
                });
            }

            mapping.mode = 'view';
            $scope.editing = false;

            $scope.filterMappings();
        };

        $scope.cancelMapping = function(mapping) {

            mapping.mode = 'view';
            $scope.editing = false;

            if (mapping.state === 'add') {
                $scope.mappings = $scope.mappings.filter(function(map) {
                    return map._id !== mapping._id;
                });
            } else {
                delete mapping.state;
            }

            $scope.filterMappings();
        };

        $scope.deleteMapping = function(mapping) {

            var categoryMapping = new CategoryMapping(mapping);

            categoryMapping.$remove(function() {
                $scope.mappings = $scope.mappings.filter(function(map) {
                    return map._id !== mapping._id;
                });
                $scope.filterMappings();
            }, function(errorResponse) {
                console.log("CategoryMapping remove failed: ", errorResponse);
            });
        };

        $scope.sortMappings = function(sortProperty, subProperty) {

            if ($scope.sort.property === sortProperty) {
                if ($scope.sort.direction === 'ascending') {
                    $scope.sort.direction = 'descending';
                } else {
                    $scope.sort.direction = 'ascending';
                }
            } else {
                $scope.sort.direction = 'ascending';
            }

            $scope.sort.property = sortProperty;
            $scope.sort.subProperty = subProperty;

            CommonService.sortObjectArray($scope.filteredMappings, $scope.sort);
        };

        $scope.categorySelected = function(cat) {

            $scope.subcategories = cat.subcategories;
        };

        $scope.filterMappings = function() {

            $scope.filteredMappings = categoryMappingFilter($scope.mappings, $scope.mappingFilterCategory);
        };

        function resetMappings() {

            $scope.mappings.forEach(function(mapping) {
                delete mapping.mode;
                delete mapping.state;
            });
        }
    }
]);
angular.module('categoryMapping').filter("categoryMapping", function() {

    return function(mappings, filterCategory) {

        var filteredMappings = [];

        mappings.forEach(function(mapping) {

            var categoryMatches = false;

            if (filterCategory === 'all' || mapping.category.name === filterCategory) {
                categoryMatches = true;
                filteredMappings.push(mapping);
            }
        });


        return filteredMappings;
  };
});


angular.module('categoryMapping', ['ngResource', 'common', 'mwl.confirm']);

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
/*
 * categoryNameValidator:
 *
 * For new categories, makes an asynchronous server call to check whether the new category
 * name is unique.
 *
 * Usage:
 *    - add category-name-validator attribute to element
 *    - add state attribute to element, with value 'add' when adding a new category
 */
angular.module('common').directive('categoryNameValidator', ['$http', '$q', 'Category', function($http, $q, Category) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            if (attrs.state === 'add') {
                ngModelController.$asyncValidators.categoryName = function(modelValue, viewValue) {
                    return Category.isCategoryNameUnique(
                        {categoryName: viewValue},
                        function(response) {
                            console.log("isCategoryNameUnique:", response.isCategoryNameUnique);
                            if (!response.isCategoryNameUnique) {
                                ngModelController.$setValidity('category', false);
                                return $q.reject("Duplicate category name");
                            } else {
                                ngModelController.$setValidity('category', true);
                                return $q.resolve(true);
                            }
                        }
                    ).$promise;
                };
            }
        }
    };
}]);

angular.module('category').controller('CategoryController', ['$scope', '$http', '$timeout', '$location',
    'Category', 'Expense', 'CommonService', 'toastr', 'categories',
    function($scope, $http, $timeout, $location, Category, Expense, CommonService, toastr, categories) {

        initialize();

        function initialize() {

            $scope.categories = categories;
            $scope.editing = false;
            $scope.focusCategoryInput = true;
            //$scope.focusSubcategoryInput = true;
            $scope.errors = [];
            $scope.sort = {
                property: 'name',
                subProperty: undefined,
                direction: 'ascending',
                type: 'string'
            };

            CommonService.sortObjectArray($scope.categories, $scope.sort);
        }

        $scope.addCategory = function() {

            if (!$scope.categories) {
                $scope.categories = [];
            }

            if ($scope.editing) {
                resetCategories();
            }

            $scope.categories.unshift({name: '', subcategories: [{name: ''}], mode: 'edit', state: 'add'});

            $scope.editing = true;
        };

        $scope.editCategory = function(category) {

            if ($scope.editing) {
               resetCategories();
            }

            category.mode = 'edit';
            category.state = '';

            $scope.editing = true;
        };

        $scope.saveCategory = function(category) {

            category.subcategories = category.subcategories.filter(function(subcategory) {
                return subcategory.name.length;
            });

            $scope.sortCategories();
            $scope.sortSubcategories(category);

            var cat = new Category(category);

            if (category.state === 'add') {
                cat.$save(function(response) {
                    angular.copy(response, category);
                }, function(errorResponse) {
                    console.log("Category save failed: ", errorResponse);
                    toastr.error('Unable to save the category', 'Expense Tracker Processing Error');
                });
            } else {
                cat.$update(function(response) {
                    angular.copy(response, category);
                }, function(errorResponse) {
                    console.log("Category update failed: ", errorResponse);
                    toastr.error('Unable to save the category', 'Expense Tracker Processing Error');
                });
            }

            category.mode = 'view';
            $scope.editing = false;
        };

        $scope.cancelCategory = function(category) {

            category.mode = 'view';
            $scope.editing = false;

            if (category.state === 'add') {
                $scope.categories = $scope.categories.filter(function(cat) {
                    return cat.name !== category.name;
                });
            } else {
                delete category.state;
            }
        };

        $scope.deleteCategory = function(category) {

            Expense.isCategoryInUse({categoryId: category._id}, function(response) {
                    if (response.isCategoryInUse) {
                        toastr.error('Category has already been assigned to expenses', 'Cannot delete the category');
                    } else {
                        var cat = new Category(category);
                        cat.$remove(function() {
                            $scope.categories = $scope.categories.filter(function(cat) {
                                return cat._id !== category._id;
                            });
                        }, function(errorResponse) {
                            console.log("Category remove failed: ", errorResponse);
                            toastr.error('Unable to delete the category', 'Expense Tracker Processing Error');
                        });
                    }
                },
                function() {
                    toastr.error('Unable to delete the category', 'Expense Tracker Processing Error');
                }
            );

        };

        $scope.addSubcategory = function(category) {

            if (!category.subcategories) {
                category.subcategories = [];
            }

            if (category.subcategories.length === 0 || category.subcategories[0].name.length) {
                category.subcategories.unshift({name: ''});
            }
        };

        $scope.deleteSubcategory = function(category, subcategory) {

            category.subcategories = category.subcategories.filter(function(subcat) {
                return subcat.name !== subcategory.name;
            });
        };

        $scope.sortCategories = function() {

            if ($scope.sort.direction === 'ascending') {
                $scope.sort.direction = 'descending';
            } else {
                $scope.sort.direction = 'ascending';
            }

            CommonService.sortObjectArray($scope.categories, $scope.sort);
        };

        $scope.sortSubcategories = function(category) {

            CommonService.sortObjectArray(category.subcategories, $scope.sort);
        };

        function resetCategories() {

            $scope.categories.forEach(function(cat) {
                delete cat.mode;
                delete cat.state;
            });
        }
    }
]);
angular.module('category', ['ngResource', 'common', 'mwl.confirm']);


angular.module('category').factory('Category', ['$resource',
    function($resource) {
        return $resource('/category/:categoryId', {
            categoryId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            isCategoryNameUnique: {
                url: '/category-name/:categoryName',
                method: 'GET'
            }
        });
    }]);

angular.module('common', []);

angular.module('common').factory('CommonService', [function () {

    return {
        sortObjectArray: function(arr, sort) {

            if (!arr || !sort) {
                return;
            }

            var multiplier = (sort.direction === 'ascending' ? 1 : -1);

            if (!arr || arr.length === 0) {
                return;
            }

            if (sort.type === 'number') {

                arr.sort(function(obj1, obj2) {

                    if (obj1[sort.property] && obj2[sort.property]) {
                        return (obj1[sort.property] - obj2[sort.property]) * multiplier;
                    } else if (obj1[sort.property]) {
                        return 1 * multiplier;
                    } else if (obj2[sort.property]) {
                        return -1 * multiplier;
                    } else {
                        return 0;
                    }
                });

            } else if (sort.type === 'string') {

                arr.sort(function(obj1, obj2) {

                    var prop1 = obj1[sort.property],
                        prop2 = obj2[sort.property];

                    if (sort.subProperty) {
                        if (prop1) {
                            prop1 = obj1[sort.property][sort.subProperty];
                        }
                        if (prop2) {
                            prop2 = obj2[sort.property][sort.subProperty];
                        }
                    }

                    if (prop1 && prop2) {
                        prop1 = prop1.toLowerCase();
                        prop2 = prop2.toLowerCase();

                        if (prop1 > prop2) {
                            return 1 * multiplier;
                        }
                        if (prop1 < prop2) {
                            return -1 * multiplier;
                        }
                        return 0;
                    } else if (prop1) {
                        return 1 * multiplier;
                    } else if (prop2) {
                        return -1 * multiplier;
                    } else {
                        return 0;
                    }

                });
            }
        },

        isYearValid: function(year) {

            if (year >= 1900 && year <= 3000) {
                return true;
            } else {
                return false;
            }
        },

        getMonthStartDate: function(dt) {

            var monthDate = dt ? dt : new Date();

            return new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        },

        getMonthEndDate: function(dt) {

            var monthDate = dt ? dt : new Date();

            return new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        },

        addCategoryToArray: function(dataArray, categories, categoryIdProperty) {

            var self = this;

            dataArray.forEach(function(arrayItem) {
                self.addCategory(arrayItem, categories, categoryIdProperty);
            });
        },

        addCategory: function(item, categories, categoryIdProperty) {

            var propertyLevels = categoryIdProperty.split('\.'),
                category = [],
                itemCategoryId;

            if (propertyLevels.length === 1) {
                itemCategoryId = item[propertyLevels[0]];
            } else if (propertyLevels.length === 2) {
                itemCategoryId = item[propertyLevels[0]][propertyLevels[1]];
            } else if (propertyLevels.length === 3) {
                itemCategoryId = item[propertyLevels[0]][propertyLevels[1]][propertyLevels[3]];
            }

            category = categories.filter(function(cat) {
                return cat._id === itemCategoryId;
            });

            if (category.length) {
                item.category = category[0];
            }
        }
    };
}]);


/*
 * Focuses the element unconditionally
*/
angular.module('common').directive('autoFocus', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function() {
                element[0].focus();
            });
        }
    };
}]);

/*
 * categoryNameValidator:
 *
 * For new categories, makes an asynchronous server call to check whether the new category
 * name is unique.
 *
 * Usage:
 *    - add category-name-validator attribute to element
 *    - add state attribute to element, with value 'add' when adding a new category
 */
angular.module('common').directive('categoryNameValidator', ["$http", "$q", function($http, $q) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {
            if (attrs.state === 'add') {
                ngModelController.$asyncValidators.categoryName = function(modelValue, viewValue) {
                    return $http.get('/category-name/' + viewValue).then(
                        function(response) {
                            if (response.data && response.data._id) {
                                return $q.reject("Duplicate category name");
                            }
                            return true;
                        }
                    );
                };
            }
        }
    };
}]);
/*
 * Listens to the input file element's change event and then adds the selected file name to a scope variable
 */
angular.module('common').directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            element.bind('change', function() {
                scope.$apply(function() {
                    model.assign(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
/*
 * Focuses the element if the specified scope variable is true
 */
angular.module('common').directive('focus', ['$timeout', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$watch(attrs.focus,
                function (newValue) {
                    if (newValue) {
                        $timeout(function() {
                            element[0].focus();
                        });
                    }
                },true);
        }
    };
}]);

/*
 *
 *      <div loading-state="app.expenses">Loading... <img src="app/images/spinner.gif"/></div>
 */
angular.module('common').directive('loadingState', ["$rootScope", function ($rootScope) {

    var loadingStates = {};

    $rootScope.$on('$stateChangeStart', function (event, toState) {
        loadingStates[toState.name] = true;
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        delete loadingStates[toState.name];
    });

    $rootScope.$on('$stateChangeError', function (event, toState) {
        delete loadingStates[toState.name];
    });

    $rootScope.$on('$stateNotFound', function (event, toState) {
        delete loadingStates[toState.name];
    });

    return {
        template: '<div ng-show="loading[state]" ng-transclude></div>',
        transclude: true,
        scope: {
            state: '@loadingState'
        },
        controller: ["$scope", function ($scope) {
            $scope.loading = loadingStates;
        }]
    };
}]);
/*
 * Extends ng-repeat by emitting an event when ng-repeat has finished rendering
 */
angular.module('common').directive('ngRepeat', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            if (scope.$last) {
                if (attrs.repeatDoneEvent) {
                    scope.$emit(attrs.repeatDoneEvent, elem);
                }
            }
        }
    };
});
angular.module('common').factory('ValidationService', ["$http", "$q", function($http, $q) {
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
}]);
angular.module('expense').controller('ExpenseController', ['$scope', '$timeout', 'Expense',
   'expenseFilter', 'CommonService', 'categories',

    function($scope, $timeout, Expense, expenseFilter, CommonService, categories) {

        initialize();

        function initialize() {

            $scope.categories = categories;
            $scope.expenses = [];
            $scope.filteredExpenses = [];

            $scope.editing = false;
            $scope.isDatePickerOpen = false;
            $scope.isFilterFromDatePickerOpen = false;
            $scope.isFilterToDatePickerOpen = false;
            $scope.focusExpenseInput = true;
            $scope.subcategories = [];

            $scope.sort = {
                property: 'trxDate',
                subProperty: undefined,
                direction: 'ascending',
                type: 'number'
            };

            $scope.filter = {
                fromDate: CommonService.getMonthStartDate(),
                toDate: CommonService.getMonthEndDate(),
                categoryId: '-1'
            };

            getExpenseData();
        }

        $scope.find = function() {

            $scope.expenses = Expense.query();
        };

        $scope.addExpense = function() {

            if ($scope.editing) {
                resetExpenses();
            }

            $scope.filteredExpenses.unshift({
                trxDate: '',
                category: '',
                subcategory: '',
                description: '',
                amount: '',
                mode: 'edit',
                state: 'add'
            });

            $scope.editing = true;
            $scope.subcategories = [];
        };

        $scope.editExpense = function(exp) {

            var items;

            if ($scope.editing) {
               resetExpenses();
            }

            exp.mode = 'edit';
            exp.state = '';

            $scope.editing = true;
            $scope.subcategories = [];

            items = $scope.categories.filter(function(cat) {
                return cat._id === exp.category._id;
            });
            exp.selectedCategory = items.length ? items[0] : '';

            if (exp.selectedCategory) {
                $scope.subcategories = exp.selectedCategory.subcategories;
                items = $scope.subcategories.filter(function(subcat) {
                    return subcat.name === exp.subcategory;
                });
                exp.selectedSubcategory = items.length ? items[0] : '';
            }
        };

        $scope.saveExpense = function(expense) {

            expense.category = expense.selectedCategory;
            expense.categoryId = expense.selectedCategory._id;
            expense.subcategory = expense.selectedSubcategory.name;

            expense.amount = parseInt(expense.amount, 10);

            var exp = new Expense(expense);

            if (expense.state === 'add') {
                exp.$save(function() {
                    CommonService.addCategory(expense, $scope.categories, 'category');
                    expense.trxDate = new Date(expense.trxDate);
                    $scope.expenses.push(expense);
                    $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);
                    CommonService.sortObjectArray($scope.filteredExpenses, $scope.sort);
                }, function(errorResponse) {
                    console.log("Save expense failed: ", errorResponse);
                });
            } else {
                exp.$update(function() {
                    $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);
                    CommonService.sortObjectArray($scope.filteredExpenses, $scope.sort);
                }, function(errorResponse) {
                    console.log("Update expense failed: ", errorResponse);
                });
            }

            expense.mode = 'view';
            $scope.editing = false;
        };

        $scope.cancelExpense = function(expense) {

            expense.mode = 'view';
            $scope.editing = false;

            if (expense.state === 'add') {
                $scope.expenses = $scope.expenses.filter(function(exp) {
                    return exp._id !== expense._id;
                });
            } else {
                delete expense.state;
            }

            $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);
            CommonService.sortObjectArray($scope.filteredExpenses, $scope.sort);
        };

        $scope.deleteExpense = function(expense) {

            var exp = new Expense(expense);

            exp.$remove(function() {
                $scope.expenses = $scope.expenses.filter(function(exp) {
                    return exp._id !== expense._id;
                });

                $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);
                CommonService.sortObjectArray($scope.filteredExpenses, $scope.sort);
            }, function(errorResponse) {
                console.log("Expense remove failed: ", errorResponse);
            });
        };

        $scope.sortExpenses = function(property, subProperty) {

            if ($scope.sort.property === property) {
                if ($scope.sort.direction === 'ascending') {
                    $scope.sort.direction = 'descending';
                } else {
                    $scope.sort.direction = 'ascending';
                }
            } else {
                $scope.sort.direction = 'ascending';
            }

            $scope.sort.property = property;
            $scope.sort.subProperty = subProperty;
            $scope.sort.type = (property === 'trxDate' || property === 'amount') ? 'number' : 'string';

            CommonService.sortObjectArray($scope.filteredExpenses, $scope.sort);
        };

        $scope.categorySelected = function(cat) {

            $scope.subcategories = cat.subcategories;
         };

        $scope.filterExpenses = function() {

            if ($scope.filter.fromDate && $scope.filter.toDate) {
                $scope.filter.fromDate = new Date($scope.filter.fromDate);
                $scope.filter.toDate = new Date($scope.filter.toDate);
            }

            getExpenseData();
        };

        $scope.filterDatePickerOpen = function($event, which) {

            if (which === 'from') {
                $scope.isFilterFromDatePickerOpen = true;
            } else {
                $scope.isFilterToDatePickerOpen = true;
            }
        };

        $scope.datePickerOpen = function($event, exp) {

            $scope.isDatePickerOpen = true;
            exp.isDatePickerOpen = true;
        };

        function getExpenseData() {

            Expense.query({
                fromDate: $scope.filter.fromDate,
                toDate: $scope.filter.toDate,
                categoryId: $scope.filter.categoryId
            }, function(response) {
                $scope.expenses = response;

                CommonService.addCategoryToArray($scope.expenses, $scope.categories, 'categoryId');

                $scope.filteredExpenses = expenseFilter($scope.expenses, $scope.filter);

                CommonService.sortObjectArray($scope.filteredExpenses, $scope.sort);
            }, function(errorResponse) {
                console.log("Error retrieving expense data");
                errorResponse.statusText = "Unable to retrieve expense";
            });
        }

        function resetExpenses() {

            $scope.expenses.forEach(function(exp) {
                delete exp.mode;
                delete exp.state;
            });
        }
}]);

angular.module('expense').filter("expense", function() {

    return function(expenses, filter) {

        var filteredExpenses = [];

        expenses.forEach(function(expense) {

            var dateMatches = false,
                categoryMatches = false;

            if (expense.trxDate) {
                if (expense.trxDate >= filter.fromDate && expense.trxDate <= filter.toDate) {
                    dateMatches = true;
                }
            } else {
                dateMatches = true;
            }

            if (filter.categoryId === '-1' || expense.categoryId === filter.categoryId) {
                categoryMatches = true;
            }

            if (dateMatches && categoryMatches) {
                filteredExpenses.push(expense);
            }
        });

        return filteredExpenses;
    };
});

angular.module('expense', ['ngResource', 'ui.bootstrap', 'common', 'mwl.confirm']);

angular.module('expense').factory('Expense', ['$resource', '$http',
    function($resource, $http) {

        return $resource('/expense/:expenseId', {
            expenseId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            query: {
                method: 'GET',
                isArray: true,
                transformResponse: $http.defaults.transformResponse.concat(convertDates)
            },
            isCategoryInUse: {
                url: '/expense-usage/:categoryId',
                method: 'GET'
            }
        });

        function convertDate(expense) {

            // "created_at" is declared as NOT NULL in the database
            expense.trxDate = new Date(expense.trxDate);

            return expense;
        }

        function convertDates(expenses) {
            if (expenses && expenses.length && expenses.map) {
                return expenses.map(convertDate);
            }
            return expenses;
        }
    }]);

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
angular.module('home', ['chart.js']);
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

angular.module('import').controller('ImportController', ['$scope', 'Papa', 'ImportService',
                                    'CommonService', 'categories', 'categoryMappings',
    function($scope, Papa, ImportService, CommonService, categories, categoryMappings) {

        initialize();

        function initialize() {

            $scope.categories = categories;
            $scope.categoryMappings = categoryMappings;
            $scope.dataUploaded = false;
            $scope.selectedRows = [];

            // Define the grid options for the angular ui-grid
            $scope.gridOptions = {
                enableColumnMenus: false,
                enableSorting: true,
                showGridFooter: true,
                showColumnFooter: false,
                multiselect: true,
                enableRowSelection: true,
                showSelectionCheckbox: true,
                selectedItems : $scope.selectedRows,
                enableFooterTotalSelected: true,
                enableHorizontalScrollbar: 0,

                columnDefs: getColumnDefs(),

                onRegisterApi: function(gridApi) {

                    $scope.gridApi = gridApi;

                    gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue) {
                        if (colDef.name === 'categoryName') {
                            var category = $scope.categories.filter(function(cat) {
                                return cat._id === newValue;
                            });
                            if (category.length) {
                                rowEntity.category = category[0];
                            }
                        }
                    });
                }
            };
        }

        $scope.selectFile = function() {
            console.log("select file");
            $('.import-input').click();
        };

        $scope.uploadFile = function() {

            console.log("File:", $scope.csvFile);

            Papa.parse($scope.csvFile, {
                complete: function(results) {

                    var amount, description, categoryMapping;

                    $scope.dataUploaded = true;
                    $scope.gridOptions.data = [];

                    results.data.forEach(function(row) {
                        if (row.length >= 3) {

                            amount = row[1] * -1;
                            description = row[4];

                            if (amount > 0) {
                                categoryMapping = getCategoryMapping(description);
                                $scope.gridOptions.data.push({
                                    trxDate: new Date(row[0]),
                                    amount: amount,
                                    description: row[4],
                                    category: categoryMapping.category,
                                    subcategory: categoryMapping.subcategory
                                });
                            }
                        }
                    });

                    CommonService.addCategoryToArray($scope.gridOptions.data, $scope.categories, 'category');

                    if (!$scope.$$phase) {
                        $scope.$digest($scope);
                    }
                }
            });
        };

        $scope.deleteSelected = function() {

            $scope.selectedRows = $scope.gridApi.selection.getSelectedRows();

            angular.forEach($scope.selectedRows, function(rowItem) {
                $scope.gridOptions.data.splice($scope.gridOptions.data.indexOf(rowItem),1);
            });

            $scope.clearSelected();
        };

        $scope.clearSelected = function() {

             $scope.gridApi.selection.clearSelectedRows();
        };

        $scope.importData = function() {

            $scope.expenses = $scope.gridOptions.data.filter(function(expense) {
                return expense.category._id && expense.subcategory && expense.trxDate;
            });

            $scope.expenses.forEach(function(exp) {
                exp.categoryId = exp.category._id;
            });

            ImportService.insertExpenses($scope.expenses).then(
                function() {
                    console.log("insertSpending success");
                    $scope.gridOptions.data = $scope.gridOptions.data.filter(function(expense) {
                        return !expense.category._id || !expense.subcategory || !expense.trxDate;
                    });
                },
                function(response) {
                    console.log("insertSpending error:", response);
                }
            );
        };

        function getSubcategoryOptions(row) {

            if (row.category) {
                return row.category.subcategories;
            }

            return [];
        }

        function getCategoryMapping(description) {

            var done = false,
                desc = description.toUpperCase(),
                categoryMapping = {
                    category: '',
                    subcategory: ''
                };

            for (var i = 0; i < $scope.categoryMappings.length && !done; i++) {
                if (desc.indexOf($scope.categoryMappings[i].searchText.toUpperCase()) !== -1) {
                    angular.copy($scope.categoryMappings[i], categoryMapping);
                    done = true;
                }
            }

            return categoryMapping;
        }

        function getColumnDefs() {

            return [
                {
                    field: 'trxDate',
                    displayName: 'Trx Date',
                    width: 100, minWidth: 100,
                    cellClass: 'import-grid-cell',
                    type: 'date',
                    enableCellEdit: false,
                    cellFilter: 'date:\'yyyy-MM-dd\''
                }, {
                    field: 'amount',
                    displayName: 'Amount',
                    type: 'number',
                    width: 90,
                    minWidth: 90,
                    cellClass: 'import-grid-cell amount',
                    enableCellEdit: false
                }, {
                    field: 'description',
                    displayName: 'Description',
                    minWidth: 200,
                    enableSorting: false,
                    cellTooltip: true,
                    cellClass: 'import-grid-cell',
                    enableCellEdit: false
                }, {
                    field: 'category.name',
                    name: 'categoryName',
                    displayName: 'Category',
                    width: 150,
                    minWidth: 80,
                    cellClass: 'import-grid-cell',
                    enableCellEdit: true,
                    editDropdownOptionsArray: $scope.categories,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: '_id',
                    editDropdownValueLabel: 'name'
                }, {
                    field: 'subcategory',
                    displayName: 'Subcategory',
                    width: 150,
                    minWidth: 80,
                    enableSorting: false,
                    cellClass: 'import-grid-cell',
                    enableCellEdit: true,
                    editDropdownOptionsFunction: getSubcategoryOptions,
                    editableCellTemplate: 'ui-grid/dropdownEditor',
                    editDropdownIdLabel: 'name',
                    editDropdownValueLabel: 'name'
                }
            ];
        }
    }
]);


angular.module('import').filter("mapCategory", function() {

  return function(input, idLabel, valueLabel, optionsArray) {

    console.log("Filter, input:", input, "idLabel:", idLabel, "valueLabel", valueLabel);

    var category;

    if (!input) {
        return '';
    } else {
        category = optionsArray.filter(function(cat) {
            return cat[idLabel] === input;
        });

        if (category) {
            return category[0][valueLabel];
        }
    }

    return input;
  };

});

angular.module('import', ['ui.grid', 'ui.grid.selection', 'ui.grid.edit']);

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

/*
 * The monthScroller directive can be used in conjunction with a report/table that has month columns to make the
 * report display responsive at smaller breakpoints.
 *
 * At the smaller breakpoints, it only shows 3 months (corresponding to a quarter) and hides the rest,
 * and it also displays 'Prev Months' and 'Next Months' buttons which the user can use to show the next
 * or previous 3 months.
 *
 * Usage: <month-scroller report-class="tableClassName" init-event="ngRepeatDoneEvent"></month-scroller>
 *      tableClassName    - class on table element that contains the 12 month columns
 *      ngRepeatDoneEvent - event triggered when the table row ng-repeat is complete
 *                          (see the ngRepeat extension directive which will trigger this event)
 *
 *  Note that the report table th and td cells for the months need to have Q1, Q2, Q3, and Q4 classes on them
 *  representing which quarter the month belongs to.
 */
angular.module('report').directive('monthScroller', function() {

    return {
        restrict: 'E',
        templateUrl: 'app/report/monthly/month-scroller.html',
        link: function(scope, element, attrs) {

            var $prevButton = $(element.find('.prev-button')[0]),
                $nextButton = $(element.find('.next-button')[0]),
                $monthlyReport = $('.' + attrs.reportClass),
                mql;

            mql = window.matchMedia("(max-width: 1200px)");
            mql.addListener(hideMonthCells);

            if (attrs.initEvent) {
                scope.$on(attrs.initEvent, function () {
                    hideMonthCells(mql);
                });
            } else {
                 hideMonthCells(mql);
            }

            function hideMonthCells(mql) {

                if (mql.matches) {
                    $monthlyReport.find('.Q2, .Q3, .Q4').addClass('hidden-cell');
                    $monthlyReport.find('.Q1').removeClass('hidden-cell');
                    $prevButton.prop('disabled', true);
                } else {
                    $monthlyReport.find('.Q1, .Q2, .Q3, .Q4').removeClass('hidden-cell');
                    $prevButton.prop('disabled', false);
                }
            }

            $prevButton.click(function() {

                if (!$monthlyReport.find('th.Q4.hidden-cell').length) {
                    $monthlyReport.find('.Q1, .Q2, .Q4').addClass('hidden-cell');
                    $monthlyReport.find('.Q3').removeClass('hidden-cell');
                    $prevButton.prop('disabled', false);
                    $nextButton.prop('disabled', false);
                } else if (!$monthlyReport.find('th.Q3.hidden-cell').length) {
                    $monthlyReport.find('.Q1, .Q3, .Q4').addClass('hidden-cell');
                    $monthlyReport.find('.Q2').removeClass('hidden-cell');
                    $prevButton.prop('disabled', false);
                    $nextButton.prop('disabled', false);
                } else if (!$monthlyReport.find('th.Q2.hidden-cell').length) {
                    $monthlyReport.find('.Q2, .Q3, .Q4').addClass('hidden-cell');
                    $monthlyReport.find('.Q1').removeClass('hidden-cell');
                    $prevButton.prop('disabled', true);
                    $nextButton.prop('disabled', false);
                }

                $nextButton.prop('disabled', false);

            });

            $nextButton.click(function() {

                if (!$monthlyReport.find('th.Q1.hidden-cell').length) {
                    $monthlyReport.find('.Q1, .Q3, .Q4').addClass('hidden-cell');
                    $monthlyReport.find('.Q2').removeClass('hidden-cell');
                    $prevButton.prop('disabled', false);
                    $nextButton.prop('disabled', false);
                } else if (!$monthlyReport.find('th.Q2.hidden-cell').length) {
                    $monthlyReport.find('.Q1, .Q2, .Q4').addClass('hidden-cell');
                    $monthlyReport.find('.Q3').removeClass('hidden-cell');
                    $prevButton.prop('disabled', false);
                    $nextButton.prop('disabled', false);
                } else if (!$monthlyReport.find('th.Q3.hidden-cell').length) {
                    $monthlyReport.find('.Q1, .Q2, .Q3').addClass('hidden-cell');
                    $monthlyReport.find('.Q4').removeClass('hidden-cell');
                    $prevButton.prop('disabled', false);
                    $nextButton.prop('disabled', true);
                }

                $prevButton.prop('disabled', false);
            });
        }
    };
});

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
angular.module('report', ['ui.bootstrap']);
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
