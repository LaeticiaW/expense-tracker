
angular.module('categoryMapping').controller('CategoryMappingController', ['$scope', '$http', 'CategoryMapping',
    'categoryMappingFilter', 'CommonService', 'orderByFilter', 'toastr', 'categories',

    function($scope, $http, CategoryMapping, categoryMappingFilter, CommonService, orderByFilter, toastr, categories) {

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
                    getPropertyName: function() {
                        return this.property + (this.subProperty ? '.' + this.subProperty : '');
                    }
                };

                $scope.mappingFilterCategory = 'all';

                CommonService.addCategoryToArray($scope.mappings, $scope.categories, 'category');

                $scope.filteredMappings = categoryMappingFilter($scope.mappings, $scope.mappingFilterCategory);

                $scope.filteredMappings = orderByFilter($scope.filteredMappings, $scope.sort.getPropertyName(), false);
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

            var map = new CategoryMapping(mapping);

            if (mapping.state === 'add') {
                map.$save(function(response) {
                    angular.copy(response, mapping);
                    CommonService.addCategory(mapping, $scope.categories, 'category');
                }, function(errorResponse) {
                    console.log("CategoryMapping save failed: ", errorResponse);
                    toastr.error('Unable to save the category mapping', 'Expense Tracker Processing Error');
                });
            } else {
                map.$update(function() {
                }, function(errorResponse) {
                    console.log("CategoryMapping update failed: ", errorResponse);
                    toastr.error('Unable to save the category mapping', 'Expense Tracker Processing Error');
                });
            }

            mapping.mode = 'view';
            $scope.editing = false;

            $scope.filterMappings();

            $scope.filteredMappings = orderByFilter($scope.filteredMappings, $scope.sort.getPropertyName(),
                $scope.sort.direction === 'descending');
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
                console.log("CategoryMapping delete failed: ", errorResponse);
                toastr.error('Unable to delete the category mapping', 'Expense Tracker Processing Error');
            });
        };

        $scope.sortMappings = function(sortProperty, subProperty) {

            var reverse = false;

            if ($scope.sort.property === sortProperty) {
                if ($scope.sort.direction === 'ascending') {
                    $scope.sort.direction = 'descending';
                    reverse = true;
                } else {
                    $scope.sort.direction = 'ascending';
                }
            } else {
                $scope.sort.direction = 'ascending';
            }

            $scope.sort.property = sortProperty;
            $scope.sort.subProperty = subProperty;

            $scope.filteredMappings = orderByFilter($scope.filteredMappings, $scope.sort.getPropertyName(), reverse);
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