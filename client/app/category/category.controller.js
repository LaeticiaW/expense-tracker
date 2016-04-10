
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