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